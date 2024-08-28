import { dataSources, storage } from '@infrastructures/local-storage/local-storage.module';
import { IsolationLevel } from '@shared/common/enums';
import { EntityManager } from 'typeorm';

export interface WrapInTransactionOptions {
  replication: boolean;
  // propagation?: Propagation;
  isolationLevel?: IsolationLevel;
  name?: string | symbol;
  connectionName?: string;
}

export const Transactional = (options?: WrapInTransactionOptions): MethodDecorator => {
  return (
    target: Record<string, unknown>,
    methodName: string | symbol,
    descriptor: TypedPropertyDescriptor<unknown>,
  ) => {
    const originalMethod = descriptor.value as () => unknown;

    descriptor.value = wrapInTransaction(originalMethod, { ...options, name: methodName });

    Reflect.getMetadataKeys(originalMethod).forEach((previousMetadataKey) => {
      const previousMetadata = Reflect.getMetadata(previousMetadataKey, originalMethod);

      Reflect.defineMetadata(previousMetadataKey, previousMetadata, descriptor.value as object);
    });

    Object.defineProperty(descriptor.value, 'name', {
      value: originalMethod.name,
      writable: false,
    });
  };
};

/**
 * Wraps a function in a transaction context using TypeORM's `QueryRunner`.
 * This ensures that the function's database operations are executed within a transaction,
 * allowing for commit and rollback capabilities.
 *
 * @template Fn - Type of the function to be wrapped.
 * @param fn - The function to be wrapped in a transaction. This function should perform database operations.
 * @param options - Optional configuration for the transaction.
 * @param options.isolationLevel - The isolation level for the transaction (e.g., 'READ_COMMITTED', 'SERIALIZABLE').
 * @param options.replication - Whether to use replication for the database. If true, uses 'master' connection for write operations.
 * @param options.connectionName - The name of the data source connection to use. Defaults to 'default' if not provided.
 * @returns A new function that wraps the original function with transaction management.
 */
const wrapInTransaction = <Fn extends (this: any, ...args: any[]) => ReturnType<Fn>>(
  fn: Fn,
  options?: WrapInTransactionOptions,
) => {
  /**
   * Wrapper function that manages the transaction lifecycle.
   */
  async function wrapper(this: unknown, ...args: unknown[]) {
    // Determine the isolation level and replication settings from options
    const isolationLevel = options?.isolationLevel;
    const replication = options?.replication;
    const dataSourceName = options?.connectionName ? options.connectionName : 'default';
    const dataSource = dataSources.get(dataSourceName);
    // Function to execute the original function
    const runOriginal = () => fn.apply(this, args);
    // Create a QueryRunner based on replication settings
    const queryRunner = replication ? dataSource.createQueryRunner('master') : dataSource.createQueryRunner();
    // Run the function within a transaction context
    return await storage.run(new Map<string, EntityManager>(), async () => {
      try {
        // Set the EntityManager in the storage context
        storage.getStore().set('typeOrmEntityManager', queryRunner.manager);
        // Start the transaction with the specified isolation level if provided
        isolationLevel ? await queryRunner.startTransaction(isolationLevel) : await queryRunner.startTransaction();
        // Execute the original function and capture the result
        const result = await runOriginal();
        // Commit the transaction if everything went well
        await queryRunner.commitTransaction();
        return result;
      } catch (error) {
        // Rollback the transaction in case of an error
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        // Release the QueryRunner to free resources
        await queryRunner.release();
      }
    });
  }
  // Return the wrapper function as the same type as the original function
  return wrapper as Fn;
};

export interface IAbstractRepository<QueryBuilder> {
  applySearchFilters(query: QueryBuilder, search: Record<string, any>): QueryBuilder;

  applyParamFilters(query: QueryBuilder, params: Record<string, any>): QueryBuilder;

  applyOrder(query: QueryBuilder, order: Record<string, any>): QueryBuilder;
}

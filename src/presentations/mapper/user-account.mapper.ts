import { UserAccountEntity } from 'src/infrastructures/entities/user-account.entity';
import { UserAccountResponseDto } from '../../applications/dtos/user-account/user-account-response.dto';
import { FormatHelper } from '../../shared/helpers/format.helper';
import { UserAccount } from '@domains/entities';

export class UserAccountMapper {
  public static toEntity(): UserAccountEntity {
    const entity = new UserAccountEntity();

    return entity;
  }

  public static toDto(entity: UserAccount): UserAccountResponseDto {
    const dto = new UserAccountResponseDto();
    dto.id = entity.uuid;
    dto.firstName = entity.firstName;
    dto.lastName = entity.lastName;
    dto.gender = entity.gender;
    dto.phoneNumber = entity.phoneNumber;
    dto.avatar = entity.avatar;
    dto.dateOfBirth = FormatHelper.formatDate(entity.dateOfBirth);
    dto.status = entity.status;
    dto.email = entity?.userLoginData ? entity.userLoginData.email : null;
    // dto.userLoginData = entity?.userLoginData ? UserLoginDataMapper.toDto(entity.userLoginData) : null;
    return dto;
  }
}

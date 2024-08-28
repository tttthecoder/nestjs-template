export enum UserPosition {
  /**
   * Regular user with basic access rights.
   */
  USER = 'User',

  /**
   * User associated with a company, typically with additional permissions.
   */
  COMPANY_USER = 'CompanyUser',

  /**
   * User with management rights within a company.
   */
  COMPANY_MANAGER = 'CompanyManager',

  /**
   * User with highest-level management rights, overseeing multiple companies or the entire system.
   */
  ADMIN = 'Admin',
}

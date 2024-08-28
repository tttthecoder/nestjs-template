import * as jwt from 'jsonwebtoken';

export class JwtHelper {
  public static async getExpiredDate(token): Promise<Date> {
    const decodedToken: any = await jwt.decode(token, { complete: true });
    if (!decodedToken || typeof decodedToken !== 'object') {
      return null;
    }

    const expirationTimeInSeconds = decodedToken.payload.exp;
    const expirationTimeInMillis = expirationTimeInSeconds * 1000;
    return new Date(expirationTimeInMillis);
  }
}

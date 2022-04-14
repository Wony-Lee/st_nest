import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Payload } from './jwt.payload';
import { CatsRepository } from '../../cats/cats.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly catsRepository: CatsRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'secret',
      ignoreExpiration: false,
    });
  }

  async validate(payload: Payload) {
    const cat = await this.catsRepository.findCatByIdWithoutPassword(
      payload.sub,
    );

    if (cat) {
      return cat; // request.user 에 들어가게된다.
    } else {
      // cat 에 대한 정보가 없다면 throw를 발생시킴
      throw new UnauthorizedException('잘못된 접근');
    }
  }
}

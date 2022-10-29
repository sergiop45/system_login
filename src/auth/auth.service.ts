import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt' ;
import { User } from 'src/user/entities/user.entity';
import { PayloadUser } from './PayloadUser';
import { JwtService } from '@nestjs/jwt';
import { UserToken } from './UserToken';

@Injectable()
export class AuthService {
    
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService  ) 
        {}

    login(user: User): UserToken {

        const payload: PayloadUser = {
            sub: user.id,
            email: user.email,
        }

        const Token = this.jwtService.sign(payload);

        return {
            access_token: Token,
        }


        throw new Error('Method not implemented.');
    }
    

    async validateUser(email: string, password: string) {

        const user = await this.userService.findByEmail(email);

        if(user) {
           
            const isPassIsValid = await bcrypt.compare(password, user.password);

            if (isPassIsValid) {
                
                return {
                    ...user,
                    password: undefined,
                }

            } 

        }

        throw new Error('Email or Password is incorret')
    }
}

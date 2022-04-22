import { ArgsType, Field, InputType } from '@nestjs/graphql'
import {
  IsEmail,
  IsOptional,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator'

const PASSWORD_MATCH_VALIDATION =
  /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/

@ArgsType()
@InputType()
export class CreateUserInput {
  @Field(() => String)
  @MaxLength(64)
  @MinLength(2)
  username: string

  @Field(() => String, { nullable: true })
  @MaxLength(64)
  @MinLength(2)
  @IsOptional()
  nickname: string | null

  @Field(() => String)
  @MaxLength(64)
  @MinLength(2)
  @IsEmail()
  email: string

  @Field(() => String, { nullable: true })
  @MaxLength(128)
  @MinLength(2)
  @IsOptional()
  bio: string | null

  @Field(() => String, { nullable: true })
  @MaxLength(128)
  @MinLength(2)
  @Matches(PASSWORD_MATCH_VALIDATION, {
    message:
      'Password must contain at least one number or special character, one uppercase letter and one lowercase letter',
  })
  password: string
}

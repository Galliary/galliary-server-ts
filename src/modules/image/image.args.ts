import { ArgsType, Field, InputType, Int } from '@nestjs/graphql'
import { IsOptional, Max, Min } from 'class-validator'

@ArgsType()
@InputType()
export class GetImageArgs {
  @Field(() => Int)
  @Min(0)
  @IsOptional()
  cursor = 0

  @Field(() => Int)
  @Min(1)
  @Max(50)
  @IsOptional()
  amount = 10
}

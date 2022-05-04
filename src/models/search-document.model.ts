import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('SearchDocument')
export class SearchDocument {
  @Field(() => String)
  id: string
  @Field(() => String)
  title: string
  @Field(() => String)
  description: string
  @Field(() => String)
  authorId: string
  // @Field(() => String)
  // authorName: string
  @Field(() => Date)
  createdAt: Date
  @Field(() => Date)
  updatedAt: Date
  @Field(() => [Int])
  colors: number[]
}

@ObjectType('SearchUserDocument')
export class SearchUserDocument {
  @Field(() => String)
  id: string
  @Field(() => String)
  username: string
  @Field(() => String, { nullable: true })
  nickname?: string | null
  @Field(() => String, { nullable: true })
  bio?: string | null
  @Field(() => Date)
  createdAt: Date
  @Field(() => Date)
  updatedAt: Date
}

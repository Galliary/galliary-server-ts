import { ValidatorConstraint } from 'class-validator'
import { extension, lookup } from 'mime-types'

@ValidatorConstraint({ name: 'ext', async: false })
export class ExtValidator {
  validate(ext: string) {
    const found = lookup(ext)
    if (!found) {
      return false
    }
    return extension(found)
  }

  defaultMessage() {
    return '($value) is not a valid file extension'
  }
}

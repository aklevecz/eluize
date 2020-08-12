import { AUTH_ERROR } from "./constants"
import refreshToken from "./refresh-token"

export default error => {
  console.log(error.message)
  if (error.message === AUTH_ERROR) {
    refreshToken()
  } else {
    throw new Error("freg")
  }
}

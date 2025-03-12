import { getDecryptByUser } from '@/api/phoneEncrypt'

const user = async (row, key) => {
  const obj = { userId: row.userId ? row.userId : row[key] }
  return await getDecryptByUser({
    ...obj,
    type: 2
  })
}

export default {
  user
}

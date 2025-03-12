import { getEmailByXsuo } from '@/api/phoneEncrypt'

const user = async (row, key) => {
  console.log('都可可可粉：', row)
  // const obj = { userId: row.userId ? row.userId : row[key] }
  return await getEmailByXsuo(
    row.id
  )
}

export default {
  user
}

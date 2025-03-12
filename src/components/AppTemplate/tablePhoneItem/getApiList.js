import {
  clueGetPhone,
  taskGetPhone,
  userGetPhone,
  smsGetPhone,
  systemGetPhone,
  recordGetPhone,
  deliveryGetPhone,
  getClueStudentPhone,
  getClueLinkPhone,
  platformUserGetPhone,
  getLivePhone,
  getDecryptByUser,
  getEmailByUser,
  getHighSeasClue,
  getReceiverPhone
} from '@/api/phoneEncrypt'

const userId = async row => {
  const obj = { userId: row.userId }
  return await getDecryptByUser({
    ...obj,
    type: 1
  })
}

const orderNo = async row => {
  return await getReceiverPhone(row.orderNo)
}

const clue = async row => {
  return await clueGetPhone(row.id)
}

const clueThread = async row => {
  return await getClueStudentPhone(row.id)
}

const clueLive = async row => {
  return await getLivePhone(row.id)
}
const clueLinkThread = async row => {
  return await getClueLinkPhone(row.id)
}

const crm = async row => {
  return await taskGetPhone(row.id)
}

const user = async row => {
  return await userGetPhone(row.uid)
}

const platformUser = async row => {
  return await platformUserGetPhone(row.id)
}
const platformUserId = async row => {
  return await platformUserGetPhone(row.platformUserId)
}
const system = async row => {
  return await systemGetPhone(row.uid)
}
const sms = async row => {
  return await smsGetPhone({ id: row.id })
}
const delivery = async row => {
  return await deliveryGetPhone(row.shiftId)
}

const email = async row => {
  return await getEmailByUser(row.id)
}

const record = async row => {
  const { data } = await recordGetPhone({ id: row.id })
  return {
    data: data[row.type]
  }
}
const highSeasClue = async row => {
  const { data } = await getHighSeasClue(row.id)
  return {
    data: data
  }
}

export default {
  clue,
  clueThread,
  clueLinkThread,
  crm,
  user,
  sms,
  system,
  record,
  delivery,
  platformUser,
  platformUserId,
  clueLive,
  userId,
  email,
  orderNo,
  highSeasClue
}

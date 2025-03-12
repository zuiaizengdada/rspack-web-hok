const setTime = ({ value, label }) => {
  if (!value) return {}
  const [start, end] = value
  const startTime = `${start} 00:00:00`
  const endTime = `${end} 23:59:59`

  const timeMapping = {
    addGwTime: { addGwStartTime: startTime, addGwEndTime: endTime },
    addQwTime: { addQwStartTime: startTime, addQwEndTime: endTime }
  }

  return timeMapping[label] || {}
}

export { setTime }

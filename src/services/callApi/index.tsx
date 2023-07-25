const BE_HOST = process.env.REACT_APP_BE_HOST
interface callApiProps {
  method: String,
  service: String,
  payload?: any,
  token?: String
}

async function callApi({ 
    method,
    service,
    payload,
    token
  }: callApiProps) {
  const parameters = {
    method,
    body: payload && JSON.stringify(payload),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "authorization": token ? `Bearer ${token}` : "",
    },
  }
  const url = `${BE_HOST}${service}`

  try {
    // @ts-ignore
    const res = await fetch(url, parameters)

    if (res) {
      const content = await res.json()
      if (res.status === 200) {
        return content
      }

      return {
        status: res.status,
        message: content.error,
        service: res.url,
        error: true
      }
    }
  } catch (err: any) {
    throw new Error(err.message) // need to handle this on UI too
    // return { message: 'Internal Server Error', service: err }
  }
}

export default callApi
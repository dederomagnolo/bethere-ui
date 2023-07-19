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

    const content = await res.json()

    const unauthorized = res.status
    if(unauthorized) {

    }

    return content;
  } catch (err: any) {
    // console.log(err.status);
    throw new Error(err.message)
  }
}

export default callApi
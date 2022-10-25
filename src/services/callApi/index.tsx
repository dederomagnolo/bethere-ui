const bethereUrl = 'http://localhost:8080'

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
      "auth-token": token ? token : "",
    },
  }
  const url = `${bethereUrl}${service}`

  try {
    // @ts-ignore
    const res = await fetch(url, parameters)

    const content = await res.json()
    return content;
    // we can make messages for different status codes
  } catch (err: any) {
    console.log(err);
    throw new Error(err.message)
  }
}



export default callApi
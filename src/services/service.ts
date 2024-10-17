class FetchService {
  static instance: FetchService | null = null
  token: string

  constructor() {
    this.token = ''
  }

  public static getInstance(): FetchService {
    // Check if an instance already exists.
    // If not, create one.
    if (this.instance === null) {
        this.instance = new FetchService()
    }

    // Return the instance.
    return this.instance
  }

  public setToken(token: string) {
    this.token = token
  }

  private async call ({ method, headers, service, payload }: any) {
    const parameters = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "authorization": this.token ? `Bearer ${this.token}` : "",
        ...headers
      },
      method,
      body: payload && JSON.stringify(payload),
    }
    
    const url = `${process.env.REACT_APP_BE_HOST}${service}`

    try {
      const res = await fetch(url, parameters)
  
      if (res) {
        const content = await res.json()
        if (res.status === 200) {
          return content
        }
  
        let error = new Error()
        const responseError = {
          status: res.status,
          message: content.error,
          service: res.url,
          error: true
        }
        error = {...error, ...responseError}
        throw(error);
      }
    } catch (err: any) {
      throw ({
        status: err.status,
        message: err.error,
        service: err.url,
        error: true
      })
    }
  }

  public async post({ service, payload } : any) {
    return await this.call({ service, payload, method: 'POST' })
  }

  public async get({ service, payload } : any) {
    return await this.call({ service, payload, method: 'GET' })
  }
}

const CallService = new FetchService()

export default CallService
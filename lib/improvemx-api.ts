const IMPROVMX_API_KEY = process.env.IMPROVEMX_API
const IMPROVMX_DOMAIN = process.env.IMPROVMX_DOMAIN
const IMPROVMX_BASE_URL = 'https://api.improvmx.com/v3'

export interface ImprovMXAlias {
  alias: string
  forward: string
  id: number
}

export class ImprovMXAPI {
  private static async makeRequest(endpoint: string, options: RequestInit = {}) {
    if (!IMPROVMX_API_KEY) {
      throw new Error('ImprovMX API key not configured')
    }

    const response = await fetch(`${IMPROVMX_BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`api:${IMPROVMX_API_KEY}`).toString('base64')}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`ImprovMX API error: ${response.status} - ${error}`)
    }

    return response.json()
  }

  static async createAlias(alias: string, forward: string): Promise<ImprovMXAlias> {
    if (!IMPROVMX_DOMAIN) {
      throw new Error('ImprovMX domain not configured')
    }

    const data = await this.makeRequest(`/domains/${IMPROVMX_DOMAIN}/aliases`, {
      method: 'POST',
      body: JSON.stringify({
        alias,
        forward,
      }),
    })

    return data.alias
  }

  static async deleteAlias(aliasId: number): Promise<void> {
    if (!IMPROVMX_DOMAIN) {
      throw new Error('ImprovMX domain not configured')
    }

    await this.makeRequest(`/domains/${IMPROVMX_DOMAIN}/aliases/${aliasId}`, {
      method: 'DELETE',
    })
  }

  static async listAliases(): Promise<ImprovMXAlias[]> {
    if (!IMPROVMX_DOMAIN) {
      throw new Error('ImprovMX domain not configured')
    }

    const data = await this.makeRequest(`/domains/${IMPROVMX_DOMAIN}/aliases`)
    return data.aliases || []
  }

  static async getDomainInfo() {
    if (!IMPROVMX_DOMAIN) {
      throw new Error('ImprovMX domain not configured')
    }

    return this.makeRequest(`/domains/${IMPROVMX_DOMAIN}`)
  }
}
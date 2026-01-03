import { api } from '@/lib/api'

// Mock fetch
global.fetch = jest.fn()

describe('APIClient', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET requests', () => {
    it('makes successful GET request', async () => {
      const mockData = { id: 1, name: 'Test' }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData
      })

      const result = await api.get('/test')

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/test',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      )
      expect(result).toEqual(mockData)
    })

    it('handles GET request errors', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ detail: 'Resource not found' })
      })

      await expect(api.get('/not-found')).rejects.toThrow('Resource not found')
    })
  })

  describe('POST requests', () => {
    it('makes successful POST request with data', async () => {
      const mockData = { success: true }
      const postData = { name: 'Test', value: 123 }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData
      })

      const result = await api.post('/create', postData)

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/create',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify(postData)
        })
      )
      expect(result).toEqual(mockData)
    })

    it('makes POST request without data', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      })

      await api.post('/action')

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/action',
        expect.objectContaining({
          method: 'POST',
          body: undefined
        })
      )
    })
  })

  describe('PUT requests', () => {
    it('makes successful PUT request', async () => {
      const updateData = { name: 'Updated' }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      })

      await api.put('/update/1', updateData)

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/update/1',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(updateData)
        })
      )
    })
  })

  describe('DELETE requests', () => {
    it('makes successful DELETE request', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      })

      await api.delete('/delete/1')

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/delete/1',
        expect.objectContaining({
          method: 'DELETE'
        })
      )
    })
  })

  describe('Error handling', () => {
    it('throws error when response is not ok', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({ detail: 'Server error occurred' })
      })

      await expect(api.get('/error')).rejects.toThrow('Server error occurred')
    })

    it('handles non-JSON error responses', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => { throw new Error('Not JSON') }
      })

      await expect(api.get('/error')).rejects.toThrow('HTTP 500')
    })

    it('handles network errors', async () => {
      ;(global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Network error')
      )

      await expect(api.get('/error')).rejects.toThrow('Network error')
    })

    it('handles unknown errors', async () => {
      ;(global.fetch as jest.Mock).mockRejectedValueOnce('Unknown error')

      await expect(api.get('/error')).rejects.toThrow('An unexpected error occurred')
    })
  })

  describe('Base URL handling', () => {
    it('uses default localhost base URL', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({})
      })

      await api.get('/test')

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('http://localhost:8000'),
        expect.any(Object)
      )
    })
  })
})

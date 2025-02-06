"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface WeatherEntry {
  id: string
  temperature: number
  humidity: number
  timestamp: string
}

/**
 * The `Home` component fetches weather data from an API and displays it in a card format.
 * It shows a loading skeleton while the data is being fetched.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * // Usage in a Next.js page
 * import Home from './path/to/Home';
 * 
 * export default function Page() {
 *   return <Home />;
 * }
 *
 * @remarks
 * This component uses the `useState` and `useEffect` hooks to manage state and side effects.
 * It fetches weather data from the `/api/weather` endpoint and displays it in a list.
 * Each weather entry shows the temperature, humidity, and timestamp.
 *
 * @function
 * @name Home
 */
export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchWeatherData() {
      try {
        const response = await fetch("/api/weather")
        const data = await response.json()
        setWeatherData(data)
      } catch (error) {
        console.error("Failed to fetch weather data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchWeatherData()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-blue-600">Weather Data</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="w-full h-16 mb-4 rounded-lg" />
            ))
          ) : (
            <ul className="space-y-4">
              {weatherData.map((entry) => (
                <li
                  key={entry.id}
                  className="bg-white p-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-semibold text-blue-500">{entry.temperature}°C</span>
                      <span className="text-gray-500">|</span>
                      <span className="text-lg text-gray-600">{entry.humidity}% humidity</span>
                    </div>
                    <span className="text-sm text-gray-400">{new Date(entry.timestamp).toLocaleTimeString()}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
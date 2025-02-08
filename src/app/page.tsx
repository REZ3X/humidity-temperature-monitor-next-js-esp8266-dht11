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

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchWeatherData() {
      try {
        const response = await fetch("/api/weather")
        const data = await response.json()
        console.log("Fetched weather data:", data) // Log the fetched dat
      } catch (error) {
        console.error("Failed to fetch weather data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchWeatherData()
    const interval = setInterval(fetchWeatherData, 1000)
    return () => clearInterval(interval)
  }, [])

  const getTemperatureColor = (temp: number) => {
    if (temp > 30) return "text-orange-500 bg-orange-100"
    if (temp < 20) return "text-cyan-500 bg-cyan-100"
    return "text-emerald-500 bg-emerald-100"
  }

  const getHumidityColor = (humidity: number) => {
    if (humidity > 80) return "text-blue-500 bg-blue-100"
    if (humidity < 40) return "text-amber-500 bg-amber-100"
    return "text-emerald-500 bg-emerald-100"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-cyan-100 to-emerald-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900 mb-4 sm:mb-6 md:mb-8 text-center">
          Hydroponic Monitoring System
          <span className="block text-base sm:text-lg text-blue-600 mt-2">
            Real-time Temperature & Humidity Dashboard
          </span>
        </h1>
  
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Latest Readings Card */}
          <Card className="bg-white/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-xl sm:text-2xl text-blue-800">Current Conditions</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {loading ? (
                <Skeleton className="h-20 sm:h-24 rounded-lg" />
              ) : (
                weatherData[0] && (
                  <div className="flex flex-col sm:flex-row justify-around items-center gap-4 sm:gap-6">
                    <div className="text-center w-full sm:w-auto p-3 sm:p-4 rounded-xl transition-all duration-300 hover:scale-105">
                      <div className={`text-3xl sm:text-4xl md:text-5xl font-bold p-3 sm:p-4 rounded-lg ${getTemperatureColor(weatherData[0].temperature)}`}>
                        {weatherData[0].temperature}°C
                      </div>
                      <div className="text-blue-600 mt-2 font-medium">Temperature</div>
                    </div>
                    <div className="text-center w-full sm:w-auto p-3 sm:p-4 rounded-xl transition-all duration-300 hover:scale-105">
                      <div className={`text-3xl sm:text-4xl md:text-5xl font-bold p-3 sm:p-4 rounded-lg ${getHumidityColor(weatherData[0].humidity)}`}>
                        {weatherData[0].humidity}%
                      </div>
                      <div className="text-blue-600 mt-2 font-medium">Humidity</div>
                    </div>
                  </div>
                )
              )}
            </CardContent>
          </Card>
  
          {/* History Card */}
          <Card className="bg-white/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-xl sm:text-2xl text-blue-800">History Log</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {loading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-12 rounded-lg mb-3" />
                ))
              ) : (
                <div className="space-y-3 max-h-[250px] sm:max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent">
                  {weatherData.map((entry) => (
                    <div
                      key={entry.id}
                      className="bg-white/80 p-3 sm:p-4 rounded-lg shadow-sm border border-blue-100 hover:shadow-md hover:bg-white/95 transition-all duration-300"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                          <div className={`px-2 sm:px-3 py-1 rounded-lg ${getTemperatureColor(entry.temperature)}`}>
                            <span className="text-base sm:text-xl font-semibold">{entry.temperature}°C</span>
                          </div>
                          <div className={`px-2 sm:px-3 py-1 rounded-lg ${getHumidityColor(entry.humidity)}`}>
                            <span className="text-base sm:text-xl font-semibold">{entry.humidity}%</span>
                          </div>
                        </div>
                        <time className="text-xs sm:text-sm text-blue-400 font-medium">
                          {new Date(entry.timestamp).toLocaleTimeString("id-ID", { timeZone: "Asia/Jakarta", hour12: false })} WIB
                        </time>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
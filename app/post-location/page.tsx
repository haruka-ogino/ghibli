'use client'
import SaveLocation from '@/components/SaveLocation'
import { useAIDescription, useSearchGoogle } from '@/hooks/useGoogle'
import { useAuth } from '@/hooks/useProviders'
import { GoogleSearchRes } from '@/models/google'
import { useState } from 'react'

export default function Post() {
  const { session } = useAuth()

  const [inputState, setInputState] = useState('')
  const [locations, setLocations] = useState<GoogleSearchRes[]>([])
  const [showRes, setShowRes] = useState<boolean>(false)
  const [locationProp, setLocationProp] = useState<GoogleSearchRes>()
  const [saveLocation, setSaveLocation] = useState(false)
  const [description, setDescription] = useState('')

  const search = useSearchGoogle()

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.target.value
    setInputState(input)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    search.mutate(
      { searchInput: inputState },
      {
        onSuccess: (data) => {
          setLocations(data)
          setShowRes(true)
        },
      }
    )
    setInputState('')
  }

  function handleClick(i: number) {
    setLocationProp(locations[i])
    setSaveLocation(true)
    handleGetDescription(locations[i].displayName)
  }

  const getDescription = useAIDescription()

  function handleGetDescription(locationName: string) {
    getDescription.mutate(
      { locationInfo: locationName },
      {
        onSuccess: (data) => {
          setDescription(data)
        },
      }
    )
  }

  return (
    <>
      <h1>Share a location!</h1>
      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-around flex-wrap max-w-96 m-5"
      >
        <input
          name="googleLocation"
          type="text"
          value={inputState}
          onChange={handleChange}
          placeholder="search location"
          className="m-3 pl-2 w-7/12  rounded-md"
        />
        <button type="submit" className="button-submit">
          Search
        </button>
      </form>
      {showRes && (
        <>
          <h1>Search results:</h1>
          <ul className="flex flex-col items-center text-left w-full">
            {locations.map((location, i) => (
              <li key={i} className="li-style search_result z-10 w-full">
                <div className="flex flex-col md:flex-row justify-between items-center p-3">
                  <div>
                    <h2>{location.displayName}</h2>
                    <p>{location.formattedAddress}</p>
                  </div>
                  {/* {session?.user ? ( */}
                  <button
                    className="button-submit w-72"
                    onClick={() => handleClick(i)}
                  >
                    Save Location
                  </button>
                  {/* ) : (
                    <p className="pl-3 text-center">Sign in to save location</p>
                  )} */}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
      {saveLocation && (
        <SaveLocation
          location={locationProp}
          open={setSaveLocation}
          session={session}
          description={description}
        />
      )}
    </>
  )
}

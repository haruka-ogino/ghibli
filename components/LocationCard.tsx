import { useDeleteLocation } from '@/hooks/useLocations'
import { Location } from '@/models/locations'
import { useState } from 'react'
import { FaRegTrashAlt, FaEdit } from 'react-icons/fa'
import EditPopUp from './EditPopUp'
import { useAuth } from '@/hooks/useProviders'

interface Params {
  location: Location
  title: string
  handleTagClick: (id: number) => void
  handleNameClick: (id: string) => void
  authId: string
}

export default function LocationCard({
  location,
  title,
  handleTagClick,
  handleNameClick,
  authId,
}: Params) {
  const { session } = useAuth()
  const deleteLocation = useDeleteLocation()
  const [edit, setEdit] = useState(false)

  function handleDelete(id: string) {
    const userConfirmed = window.confirm(`
      Are you sure you want to delete the location "${location.name}"?
      Once you delete this, it is permanent and cannot be undone.
    `)

    if (userConfirmed) {
      deleteLocation.mutate({ id, authId })
    }
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row items-center">
        <h2 className="text-4xl">{location.name}</h2>
        <p
          data-testid="tag-click"
          className="gradient rounded-full w-fit mx-5 my-1 px-2 cursor-pointer"
          onClick={() => handleTagClick(location.tagId)}
        >
          {location.tag}
        </p>
      </div>
      <div className="relative flex justify-center m-3">
        {title === 'My Locations' && session?.user && (
          <div className="absolute p-[5px_12px] m-[5px] self-end flex top-[-57px] right-0 gradient rounded-[20px] w-fit leading-[25px] text-[25px]">
            <button
              data-testid="edit-location"
              className="cursor-pointer hover:opacity-50 pr-4"
              onClick={() => setEdit(true)}
            >
              <FaEdit size={25} />
            </button>
            <button
              data-testid="delete-location"
              className="cursor-pointer hover:opacity-50"
              onClick={() => handleDelete(location.id)}
            >
              <FaRegTrashAlt size={25} />
            </button>
          </div>
        )}
        <img src={location.image} alt={`Location of ${location.name}`} />
      </div>
      <p className="whitespace-pre-wrap">
        {location.description.replace(/\\n/g, '\n')}
      </p>
      <p>Google rating: {location.rating} ⭐️</p>
      <p>Address:</p>
      <p>
        <a href={location.url} className="cursor-pointer" target="_blank">
          📍 {location.address}
        </a>
      </p>
      {title !== 'My Locations' ? (
        <p
          data-testid="name-click"
          className="self-center hover:underline cursor-pointer"
          onClick={() => handleNameClick(location.authId)}
        >
          By {location.username}
        </p>
      ) : (
        <p className="self-center">By {location.username}</p>
      )}
      {edit && (
        <div className="fixed w-full h-full top-0 left-0 flex justify-center items-center bg-black bg-opacity-60 z-20">
          <section className="purple_container z-30 md:w-8/12 w-11/12 text-left">
            <EditPopUp location={location} open={setEdit} />
          </section>
        </div>
      )}
    </>
  )
}

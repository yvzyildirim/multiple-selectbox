import { useEffect, useRef, useState } from 'react'
import './App.css'
import logo from '../src/assets/images/logo.png'
import { useQuery, gql } from '@apollo/client'
import { MdClose } from 'react-icons/md'
import { FaCaretDown } from 'react-icons/fa'
import { Loading } from './components/loading'
import { InfoBoard } from './components/info-board'

const characterData = gql`
  query Characters($page: Int, $filter: FilterCharacter) {
    characters(page: $page, filter: $filter) {
      info {
        count
        pages
      }
      results {
        id
        name
        image
        episode {
          name
        }
      }
    }
  }
`

function App() {
  const selectBoxRef = useRef(null)
  const listRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [characters, setCharacters] = useState([])
  const [name, setName] = useState('')
  const [selectedCharacters, setSelectedCharacters] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const { error, data } = useQuery(characterData, {
    variables: { page: currentPage, filter: { name: name } },
  })
  const pages = data?.characters.info.pages

  // Karakter listesini oluşturmaya yarıyor. Aynı zamanda mevcut aramaya göre sayfalandırma bulunuyor ise scroll durumuna göre  listeyi güncelliyor.
  useEffect(() => {
    setLoading(true)
    if (data && data.characters && data.characters.results) {
      setCharacters((prevCharacters) => [
        ...prevCharacters,
        ...data.characters.results,
      ])
      setLoading(false)
    }
  }, [data])

  const handleChangeName = (name) => {
    if (name.length > 2) {
      setCharacters([])
      setCurrentPage(1)
      setName(name)
    } else if (name.length === 0) {
      setCharacters([])
      setName('')
    }
  }

  const handleSelect = (id, name) => {
    if (selectedCharacters.some((item) => item.id === id)) {
      setSelectedCharacters(selectedCharacters.filter((item) => item.id !== id))
    } else {
      setSelectedCharacters([...selectedCharacters, { id, name }])
    }
  }

  const handleRemove = (id) => {
    setSelectedCharacters(selectedCharacters.filter((item) => item.id !== id))
  }

  const isChacked = (id) => {
    return selectedCharacters.some((item) => item.id === id)
  }

  // Selectbox dışında bir yere tıklanınca dropdownun kapanmasını sağlıyor
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        selectBoxRef.current &&
        !selectBoxRef.current.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Scroll bottom olduğunda 20 item daha çekmek için sayfa sayısını arttırıyor
  useEffect(() => {
    const handleScroll = () => {
      const current = listRef.current

      if (current) {
        const scrollPosition = current.scrollTop
        const scrollHeight = current.scrollHeight

        if (
          scrollPosition === scrollHeight - current.clientHeight &&
          currentPage < pages
        ) {
          setCurrentPage(currentPage + 1)
        }
      }
    }

    const listNode = listRef.current

    if (listNode) {
      listNode.addEventListener('scroll', handleScroll)
    }

    return () => {
      if (listNode) {
        listNode.removeEventListener('scroll', handleScroll)
      }
    }
  }, [currentPage, pages, isOpen])

  return (
    <div
      className={
        'w-full flex flex-col items-center p-6 min-h-screen  bg-background bg-bottom  bg-cover	' +
        (isOpen ? 'justify-start' : 'justify-center')
      }
    >
      <div className="w-full lg:w-5/12 flex flex-col items-center">
        <img className="w-[240px] mb-4" src={logo} alt="logo" />
        <div
          name="multiple-selectbox "
          ref={selectBoxRef}
          className="w-full relative"
        >
          <div
            onClick={() => setIsOpen(true)}
            className="border border-gray-400 rounded-xl bg-white p-4 flex flex-wrap items-center gap-2 mb-4"
          >
            {selectedCharacters &&
              selectedCharacters.map((i, index) => (
                <span
                  key={index}
                  onClick={() => handleRemove(i.id)}
                  className="p-1 bg-gray-200 rounded-xl flex items-center gap-2"
                >
                  {i.name}
                  <button className="bg-gray-500 flex items-center justify-center w-[24px] h-[24px] text-white rounded-md">
                    <MdClose />
                  </button>
                </span>
              ))}
            <div className="flex justify-between items-center flex-1">
              <input
                type="text"
                placeholder="Search character"
                className="bg-transparent h-full flex-1 focus:outline-0"
                onChange={(e) => handleChangeName(e.target.value)}
              />
              <FaCaretDown className="text-xl text-gray-600" />
            </div>
          </div>
          {isOpen && (
            <div
              ref={listRef}
              className="relative w-full border border-gray-400 bg-white rounded-xl h-[400px] overflow-scroll "
            >
              {error ? (
                <InfoBoard
                  title="Error"
                  description="Please try again later!"
                />
              ) : (
                characters.map((i, index) => {
                  const nameParts = i.name.split(new RegExp(`(${name})`, 'gi'))
                  return (
                    <>
                      <label
                        key={index}
                        className="p-4 flex items-center border-b border-gray-400 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          onChange={() => handleSelect(i.id, i.name)}
                          checked={isChacked(i.id)}
                        />
                        <img
                          className="w-[60px] h-[60px] rounded-xl ml-4 "
                          src={i.image}
                          alt={i.name}
                        />
                        <div className="flex flex-col justify-center ml-4">
                          <span className="text-lg">
                            {nameParts.map((part, index) =>
                              part.toLowerCase() === name.toLowerCase() ? (
                                <b key={index}>{part}</b>
                              ) : (
                                part
                              ),
                            )}
                          </span>
                          <span className="text-md text-gray-600">
                            {i.episode.length + ' Episodes'}
                          </span>
                        </div>
                      </label>
                      {loading && <Loading />}
                    </>
                  )
                })
              )}

              {!loading && characters.length === 0 && (
                <InfoBoard
                  title="No matching characters found for this name"
                  description="The character may never have existed or rick and morty may have erased him from time."
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App

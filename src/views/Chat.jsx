import '../styles/Chat.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignal, faCircle, faMicrophoneAlt, faGlobeAmericas, faMinus, faMaximize, faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react'
import Message from '../components/Message'

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});


const Chat = () => {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [isActive, setIsActive] = useState(false)
    const [location, setLocation] = useState({ latitude: null, longitude: null })
    const [getGeolocation, setGetGeolocation] = useState(false)
    const handleClose = () => {
        setIsActive(!isActive)
    }



    const handleOpen = () => {
        setIsActive(!isActive)
    }

    const handleLocation = () => {

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                })
            });
            setGetGeolocation(true)
           

        } else {
            alert("Geolocation is not supported by this browser.");
            setGetGeolocation(false)
        }
    }
    return (
        <div className='container'>
            <div className="container-close">
                {isActive == true ? <button className='btn-close' onClick={handleClose}>
                    <FontAwesomeIcon icon={faMinus} className='icon-close' />
                </button> :
                    <button className='btn-close' onClick={handleOpen}>
                        <FontAwesomeIcon icon={faMaximize} className='icon-close' />
                    </button>
                }
            </div>
            <div className="container-header">
                <div className='container-text'>
                    <h2 className='chat-title'>
                        PSWA
                        <span className='chat-title-bold'>
                            <FontAwesomeIcon icon={faCircle} />
                            En linea</span>
                    </h2>
                </div>
            </div>

            <div className="container-geolocalization"
                onClick={handleLocation}
            >

                <h3 className='title-geolocalization'>
                    {
                        location.latitude && location.longitude ? `Latitud: ${location.latitude} Longitud: ${location.longitude}` : 'Da click para obtener tu ubicación'
                    }
                </h3>

                <FontAwesomeIcon icon={faGlobeAmericas}
                    className='icon-geolocalization'
                />
            </div>
            {getGeolocation &&
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}>
                    <MapContainer center={[19.4082456, -99.1660116
                    ]} zoom={13} style={{ height: '200px', width: '80%' }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker position={[
                            19.4082456
                            ,
                            -99.1660116

                        ]}>
                            <Popup>
                                A pretty CSS3 popup. <br /> Easily customizable.
                            </Popup>
                        </Marker>
                    </MapContainer>
                </div>
            }


            {!isActive &&
                <div className='container-geolocalization' onClick={handleOpen}>
                    <p className='title-geolocalization'>Unirse a la conversación</p>
                    <FontAwesomeIcon icon={faChalkboardTeacher}
                        className='icon-geolocalization'

                    />
                </div>
            }
            <div className='container-controls'>
                <button className='btn-voice'>
                    <FontAwesomeIcon className='icon-voice' icon={faSignal} />
                    Voz
                </button>
                <button className='btn-silence'>
                    <FontAwesomeIcon
                        icon={faMicrophoneAlt}></FontAwesomeIcon>
                    Silenciar
                </button>
            </div>
            {isActive &&
                <div className='container-messages'>
                    <Message message={message} setMessage={setMessage} messages={messages} setMessages={setMessages} />
                </div>
            }

        </div>
    )
}

export default Chat
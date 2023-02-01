import React from 'react';
import './style.scss';

function App() {
  const [videos, setVideos] = React.useState(
    typeof localStorage !== 'undefined' ? JSON.parse(localStorage.getItem('video')) || [] : [],
  );
  const [input, setInput] = React.useState('');
  console.log(input);

  const refInput = React.useRef('');
  React.useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('video', JSON.stringify(videos));
    }
  }, [videos]);
  React.useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      const storedVideos = JSON.parse(localStorage.getItem('video'));
      if (storedVideos) {
        setVideos(storedVideos);
      }
    }
  }, []);

  const checkVideoId = async (event) => {
    event.preventDefault();
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=id&id=${input.replace(
        /^https:\/\/youtu\.be\//,
        '',
      )}&key=AIzaSyDQMjCi4kF6T2A6gVCrAWzxAN9EUAo6iEw`,
    );
    const result = await response.json();
    if (response.ok && result.items.length) {
      setVideos([...videos, input.replace(/^https:\/\/youtu\.be\//, '')]);
      document.querySelector('input').value = '';
      focusInput();
    } else {
      alert('Вы ввели неправильную ссылку или идентификатор');
      throw new Error('Вы ввели неправильную ссылку или идентификатор');
    }
    setInput('');
  };

  const removeVideo = (index) => {
    setVideos(videos.filter((_, i) => i !== index));
  };

  const focusInput = () => {
    refInput.current.focus();
  };

  return (
    <div className='App'>
      <h1>YouTube закладки</h1>
      <form action=''>
        <input
          ref={refInput}
          onChange={(event) => setInput(event.target.value)}
          type='text'
          placeholder='Введите ссылку или идентификатор видео'
        />
        <button className='btn' onClick={(event) => checkVideoId(event)}>
          Сохранить в закладки
        </button>
      </form>
      {videos.length === 0 ? (
        <div className='notFound'>
          <h2>У вас нет закладок</h2>
          <button onClick={focusInput} className='btn'>
            Добавить в закладки
          </button>
        </div>
      ) : (
        videos.map((video, index) => {
          const indexOfVideo = video.replace(/^https:\/\/youtu\.be\//, '');
          return (
            <div key={index} className='array-videos'>
              <iframe
                title='video'
                width={800}
                height={400}
                src={`https://www.youtube.com/embed/${indexOfVideo}`}
                allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in- picture'
                allowFullScreen
              />
              <button className='btn' onClick={() => removeVideo(index)}>
                Удалить видео
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}

export default App;

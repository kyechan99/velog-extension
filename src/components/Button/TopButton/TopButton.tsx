import "@assets/navButton.scss";

export const TopButton = ({ darkMode } : { darkMode : boolean }) => {

  const onClick = () => {
    // window.scrollTo(0, 0);
    window.scroll({top: 0, left: 0, behavior: 'smooth' });
  };

  return (
    <button className={`v-top-button ${darkMode ? 'dark-mode' : ''}`} onClick={onClick}>
      <svg className='v-top-svg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22">
        <path fill-rule="evenodd" d="M18.655 10.405a.75.75 0 000-1.06l-6.25-6.25a.75.75 0 00-1.06 0l-6.25 6.25a.75.75 0 101.06 1.06l4.97-4.97v14.44a.75.75 0 001.5 0V5.435l4.97 4.97a.75.75 0 001.06 0z"></path>
      </svg>
    </button>
  );
};

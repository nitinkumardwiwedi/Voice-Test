import { useState } from 'react';
import ShowChannels from './ChannelIntegrationTab';

declare global {
  interface Window {
    fbAsyncInit?: () => void;
    FB: any;
  }
}

const ChannelIntegrationTab = ({ user, projectid, setPopupType }: any) => {
  const [openBotPage, setOpenBotPage] = useState('');

  const handleCardClick = (title: string) => {
    setOpenBotPage(title);
  };

  return (
    <div className="h-full w-full p-2 xs:p-6 pt-0 your-scrollable-element remove-scrollbar">
      <ShowChannels
        openBotPage={openBotPage}
        projectid={projectid}
        user={user}
        handleCardClick={handleCardClick}
        setOpenBotPage={setOpenBotPage}
        setPopupType={setPopupType}
      />
    </div>
  );
};

export default ChannelIntegrationTab;



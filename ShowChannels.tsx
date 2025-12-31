import { getRequest } from "@/src/lib/apiBackend";
import endpoints from "@/src/lib/endpoints";
import { getProjectRoute } from "@/src/lib/utils";
import { RootState } from "@/src/store/store";
import { ShowChannelsProps } from "@/src/types/channel";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Dialog, DialogContent, DialogOverlay } from "../ui/dialog";
import WordpressTab from "./WordpressTab";
import ThreeSteps from "./ThreeSteps";
import TwoStep from "./TwoStep";
import WhatsappCustomization from "./WhatsappCustomization";
import MainLoader from "../shared/MainLoader";
import { AllListedChannels } from "@/src/lib/constant";
import ChannelCard from "./ChannelCard";

const ShowChannels: React.FC<ShowChannelsProps> = ({
  openBotPage,
  projectid,
  user,
  handleCardClick,
  setOpenBotPage,
  setPopupType,
}) => {
  const [isIntegrated, setIsIntegrated] = useState(false);
  const [channelDoc, setChannelDoc] = useState<string[]>();
  const [whatsappStep, setWhatsappStep] = useState<
    'firstStep' | 'secondStep' | 'customization' | undefined | null
  >(undefined);
  const [loading, setLoading] = useState(true);
  const activePlanLimitStatus = useSelector(
    (state: RootState) => state.globalSlice.activePlanLimitStatus,
  );
  const route = useRouter();

  const getChannelDoc = async () => {
    debugger
    try {
      setLoading(true);
      let res = await getRequest(`${endpoints?.getActiveChannel}?projectId=${projectid}`);
      res = res.data;
      setChannelDoc(res[0]?.channelTypes);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectid && activePlanLimitStatus?.subscription?.channels) {
      getChannelDoc();
    }
  }, [projectid, activePlanLimitStatus?.subscription?.channels]);

  const checkIntegrationStatus = async () => {
    try {
      setLoading(true);
      const response = await getRequest(`webhook/${projectid}`);
      if (response?.data?.whatsappDetails) {
        setIsIntegrated(true);
      } else {
        setIsIntegrated(false);
      }
    } catch (error) {
      console.error('Error checking integration status:', error);
      setIsIntegrated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkIntegrationStatus();
  }, [projectid]);

  useEffect(() => {
    if (openBotPage === 'Website') {
      route.push(getProjectRoute(projectid, 'website', 'type=Website Customization'));
    }
    if (openBotPage === 'Voice') {
      route.push(getProjectRoute(projectid, 'voiceSetting'));
    }

    if (openBotPage === 'Voice API') {
      route.push(getProjectRoute(projectid, 'voiceApi'));
    }
  }, [openBotPage]);

  switch (openBotPage) {
    // case "Website":
    //   return <SDKTab user={user} projectid={projectid} />;
    case 'Wordpress Plugin':
      return <WordpressTab user={user} projectid={projectid} />;
    default:
      return (
        <>
          <Dialog open={!!whatsappStep}>
            <DialogOverlay className="fixed inset-0 bg-[rgba(0,0,0,0.01)]" />
            <DialogContent className="max-w-[980px] max-h-[730px] focus:outline-none overflow-y-auto overflow-x-hidden p-0  !rounded-[24px] [&>button]:hidden remove-scrollbar">
              {whatsappStep === 'firstStep' && (
                <ThreeSteps
                  projectid={projectid}
                  setOpenBotPage={setOpenBotPage}
                  setWhatsappStep={setWhatsappStep}
                />
              )}
              {whatsappStep === 'secondStep' && (
                <TwoStep projectid={projectid} setWhatsappStep={setWhatsappStep} />
              )}
              {whatsappStep === 'customization' && (
                <WhatsappCustomization projectid={projectid} setWhatsappStep={setWhatsappStep} />
              )}
            </DialogContent>
          </Dialog>

          {loading ? (
            <div className="w-full h-full flex justify-center items-center">
              <MainLoader className="w-24 h-24" />
            </div>
          ) : (
            <div className="w-full px-3 border-[#CBCBCC] ">
              <div className="grid grid-cols-1 lg:grid-cols-2  gap-5 xl:grid-cols-5">
                {activePlanLimitStatus?.subscription?.channels?.length > 0 &&
                  AllListedChannels?.map((item, index) => {
                    return (
                      <ChannelCard
                        id={item?.id}
                        setPopupType={setPopupType}
                        onClickHandle={handleCardClick}
                        key={index}
                        title={item?.title}
                        description={item?.description}
                        imgSrc={item?.imgSrc}
                        isdisabled={activePlanLimitStatus.subscription.channels?.includes(
                          item.dbName,
                        )}
                        connectionText={
                          isIntegrated && item.title === 'WhatsApp'
                            ? channelDoc?.includes('WHATSAPP')
                              ? 'Customize'
                              : 'Configure'
                            : activePlanLimitStatus.subscription.channels?.includes(item.dbName)
                              ? item?.connectionText
                              : 'Configure'
                        }
                        projectId={projectid}
                        setWhatsappStep={setWhatsappStep}
                        activeChannel={activePlanLimitStatus.subscription.channels}
                        isIntegrated={isIntegrated}
                        channelDoc={channelDoc}
                      />
                    );
                  })}
              </div>
            </div>
          )}
        </>
      );
  }
};

export default ShowChannels;


// export interface ShowChannelsProps {
//   openBotPage: string;
//   projectid: string;
//   user: any;
//   handleCardClick: (title: string) => void;
//   setOpenBotPage: Dispatch<SetStateAction<string>>;
//   setPopupType: Dispatch<SetStateAction<PopupType | undefined>>;
// }
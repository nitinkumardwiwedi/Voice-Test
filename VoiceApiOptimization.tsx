import { Undo2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PiCopySimpleLight, PiWarningCircleBold } from 'react-icons/pi';
import { showErrorToast, showSuccessToast } from '../shared/CustomToast';
import { getRequest } from '@/src/lib/apiBackend';

const SAMPLE_ENDPOINT = process.env.NEXT_APP_BACKEND_URL || '';

const VoiceApiCustomization = ({ projectId }: { projectId: string }) => {
  const route = useRouter();
  const [endpoint] = useState(SAMPLE_ENDPOINT);
  const [clientId, setClientId] = useState('');

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showSuccessToast('Copied to clipboard');
    } catch (err) {
      console.log(err);
      showErrorToast('Failed to copy');
    }
  };

  const getClientId = async () => {
    try {
      const clientId = await getRequest(`crawlHistory/getCrawlerData?projectId=${projectId}`);
      setClientId(clientId?.data?.clientId);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getClientId();
  }, []);

//   const curlExample = `curl -X POST https://api.exei.ai/v1/agents/agent_abc123/chat \\
//   -H "Authorization: Bearer 09qw4876687980-98767tyhjas" \\
//   -H "Content-Type: application/json" \\
//   -d '{
//     "message": "Hello, how can you help me?",
//     "user_id": "user_123"
//   }'`;

  return (
    <div className="w-full h-full">
      <div className="min-h-[104px] w-full border-b border-[#CBCBCC] flex items-center gap-4 px-2 sm:px-6 lg:px-12">
        <div className="sm:h-[36px] h-[30px] sm:w-9 w-7 hover:bg-gray-100 rounded-full flex justify-center items-center cursor-pointer">
          <Undo2
            className="sm:h-[24px] h-[18px] sm:w-[24px] w-[18px]"
            onClick={() => route.back()}
          />
        </div>
        <h1 className="text-[20px] sm:text-[24px] font-[600] whitespace-nowrap">
          Voice API Configuration
        </h1>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        <div className="w-full py-5 px-4 sm:px-6 border border-gray-200 rounded-[12px]">
          <div className="space-y-2">
            <label className="text-md font-semibold">API Endpoint</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                readOnly
                value={endpoint}
                className="w-full rounded-lg border border-gray-200 px-3 py-2
                           text-sm bg-white text-[#98999A] outline-none h-[42px]"
              />
              <button
                onClick={() => copyToClipboard(endpoint)}
                className="px-3 py-2 bg-white border border-gray-200 rounded-md text-xs font-medium
                   w-full sm:w-[137px] h-[42px]
                   flex items-center justify-center gap-2"
              >
                <PiCopySimpleLight size={18} />
                Copy
              </button>
            </div>
          </div>
        </div>

        <div className="w-full py-5 px-4 sm:px-6 border border-gray-200 rounded-[12px]">
          <div className="space-y-2">
            <label className="text-md font-semibold">Client Id</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                readOnly
                value={clientId}
                className="w-full rounded-lg border border-gray-200 px-3 py-2
                           text-sm bg-white h-[42px] text-[#98999A]"
              />
              <button
                onClick={() => copyToClipboard(endpoint)}
                className="px-3 py-2 bg-white border border-gray-200 rounded-md text-xs font-medium
                   w-full sm:w-[137px] h-[42px]
                   flex items-center justify-center gap-2"
              >
                <PiCopySimpleLight size={18} />
                Copy
              </button>
            </div>
          </div>

          <div className="bg-[#F5F7FE] rounded-[10px] p-3 border border-[#BEDBFF] mt-5 flex items-center gap-3">
            <PiWarningCircleBold size={20} className="text-[#4568F2] font-semibold rotate-180" />
            <p className="text-black text-xs font-medium leading-relaxed">
              Keep this Client I d secure. Do not share it publicly or commit it to version control.
            </p>
          </div>
        </div>

        {/* <div className="space-y-2">
          <label className="text-sm font-medium">cURL Example</label>
          <div className="relative">
            <pre
              className="whitespace-pre-wrap rounded-lg border border-gray-200 bg-gray-50 p-4 text-xs sm:text-sm overflow-x-auto">
              {curlExample}
            </pre>
            <button
              onClick={() => copyToClipboard(curlExample)}
              className="absolute right-2 top-2 sm:right-3 sm:top-3 px-3 py-1 bg-black text-white text-xs rounded">
              Copy
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default VoiceApiCustomization;

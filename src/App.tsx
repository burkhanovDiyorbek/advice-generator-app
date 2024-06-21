import axios from "axios";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface Data {
  slip: Slip;
}

interface Slip {
  advice: string;
  id: number;
}

function App() {
  const [data, setData] = useState<Data>({ slip: { advice: "", id: 0 } });
  const [change, setChange] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [audioStarted, setAudioStarted] = useState<boolean>(false);
  function speak(value: string): void {
    const utterance: SpeechSynthesisUtterance = new SpeechSynthesisUtterance(
      value
    );

    const voices = speechSynthesis.getVoices();
    utterance.voice = voices[3];

    utterance.onstart = () => {
      setAudioStarted(true);
    };

    utterance.onend = () => {
      setAudioStarted(false);
    };

    speechSynthesis.speak(utterance);
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const req = await axios.get("https://api.adviceslip.com/advice");
        setTimeout(() => {
          setData(req.data);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [change]);
  return loading ? (
    <div className="bg-[#313A48] rounded-3xl shadow-[30px 50px 80px 0px rgba(0, 0, 0, 0.10)] flex flex-col  p-[48px] text-center max-w-[540px] relative w-[100vw]">
      <Skeleton className="text-[#53FFAA] font-semibold text-sm tracking-[5px] mb-[24px] inline-block	w-[40px] h-[18px]" />
      <Skeleton
        className="text-[28px] text-[#CEE3E9] font-bold mb-4 max-w-[444px] w-[100%]"
        count={2.5}
      />
      <div className="flex justify-around items-center w-[100%] mb-9">
        <Skeleton className="border-b-2 w-[30%]" />
        <Skeleton className="w-[20px] h-[20px] " />
        <Skeleton className="border-b-2 w-[30%]" />
      </div>
      <Skeleton className="mb-[-150px] w-[64px] h-[64px] rounded-[50%] " />
    </div>
  ) : (
    <div className="bg-[#313A48] rounded-3xl shadow-[30px 50px 80px 0px rgba(0, 0, 0, 0.10)] flex flex-col  p-[48px] text-center max-w-[540px] relative">
      <span className="text-[#53FFAA] font-semibold text-sm tracking-[5px] mb-[24px] inline-block	">
        ADVICE #{data?.slip.id}
      </span>
      <h2 className="text-[28px] text-[#CEE3E9] font-bold mb-[40px]">
        {data?.slip.advice}
      </h2>
      <div className="flex justify-around items-center w-[100%] mb-9">
        <p className="border-b-2 w-[30%]"></p>
        {!audioStarted ? (
          <img
            src="./assets/play.svg"
            alt="play svg"
            onClick={() => speak(data?.slip.advice)}
            className="cursor-pointer w-[20px] h-[20px] "
          />
        ) : (
          <img
            src="./assets/pause.svg"
            alt="play svg"
            className="cursor-pointer w-[20px] h-[20px] "
          />
        )}
        <p className="border-b-2 w-[30%]"></p>
      </div>
      <button
        className="mb-[-80px] mx-auto"
        onClick={() => {
          setChange((prev) => prev + 1);
        }}
      >
        <img src="./assets/generate.svg" alt="generate svg" />
      </button>
    </div>
  );
}

export default App;

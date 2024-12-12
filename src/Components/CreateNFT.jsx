import {
  useGlobalState,
  setGlobalState,
  setLoadingMsg,
  setAlert,
} from "../store";
import { useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { mintNFT, uploadToPinata } from "../Blockchain.services";
import { FiUpload } from "react-icons/fi";

const style = { color: "white", fontSize: "1.5em" };

const CreateNFT = () => {
  const [isMinting, setIsMinting] = useState(false);
  const [modal] = useGlobalState("modal");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [imgBase64, setImgBase64] = useState(null);

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !price || !description) return;

    setGlobalState("modal", "scale-0");
    setGlobalState("loading", { show: true, msg: "Uploading IPFS data..." });
    try {
      const metadataURI = await uploadToPinata(fileUrl);
      const nft = { title, description, metadataURI, price };
      
      setIsMinting(true)
      setLoadingMsg('Intializing transaction...')
      setFileUrl(metadataURI)
      await mintNFT(nft)

      resetForm()
      setAlert('Minting completed...', 'green')
      setIsMinting(false)
      window.location.reload()
    } catch (error) {
      console.log('Error uploading file: ', error)
      setAlert('Minting failed...', 'red')
    }
  };

  const changeImage = async (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) reader.readAsDataURL(e.target.files[0]);

    reader.onload = (readerEvent) => {
      const file = readerEvent.target.result;
      setImgBase64(file);
      setFileUrl(e.target.files[0]);
    };
  };

  const closeModal = () => {
    setGlobalState("modal", "scale-0");
    resetForm();
  };

  const resetForm = () => {
    setFileUrl("");
    setImgBase64(null);
    setTitle("");
    setPrice("");
    setDescription("");
  };
  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen
    flex items-center justify-center bg-black bg-opacity-30 
    transform duration-300 font-globalFont ${modal}`}
    >
      <div className="w-11/12 md:w-3/12 h-7/12 p-4 bg-gray-50 shadow-lg rounded-xl text-gray-400 ">
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="flex items-center justify-between">
            <h2 className="text-gray-400 font-semibold text-lg">Create NFT</h2>
            <button type="button" onClick={closeModal}>
              <AiOutlineCloseCircle className="font-bold text-2xl text-gray-900" />
            </button>
          </div>
          <div className="flex justify-center items-center rounded-lg mt-1">
            <div className="w-24 h-24 overflow-hidden  shrink-0">
              <img
                className="rounded-full h-full w-full object-cover cursor-pointer"
                src={
                  imgBase64 ||
                  "https://www.shutterstock.com/image-vector/picture-icon-vector-260nw-1353828443.jpg"
                }
                alt="NFT"
              />
            </div>
          </div>
          <div className="flex flex-row justify-center items-center rounded-lg mt-4">
            <label
              className="flex text-sm gap-2 justify-center items-center shadow-xl icon rounded-full w-10 h-10
                bg-transparent cursor-pointer getstarted"
              for="file-input"
            >
              <FiUpload style={style} />
            </label>
            <span className="sr-only">Choose profile photo</span>
            <input
              required
              id="file-input"
              type="file"
              accept="image/png, image/gif, image/jpeg, image/webp"
              className=" w-full text-sm text-slate-500 hidden
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:shadow-lg
                  file:text-sm file:font-semibold
                file:text-gray-400
                hover:file:text-gray-50
                  hover:file:bg-[rgba(34,193,195,1)]
                  cursor-pointer focus:ring-0 focus:outline-none"
              onChange={changeImage}
            />
          </div>
          <div className="flex flex-row justify-between items-center bg-gray-50 border rounded-lg mt-5">
            <input
              className="block w-full text-sm
                text-slate-500 bg-transparent border-0
                focus:outline-none focus:ring-0"
              type="text"
              name="title"
              placeholder="Title"
              required
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
          </div>
          <div className="flex flex-row justify-between items-center bg-gray-50 border rounded-lg mt-5">
            <input
              className="block w-full text-sm
                text-slate-500 bg-transparent border-0
                focus:outline-none focus:ring-0"
              type="number"
              step={0.01}
              min={0.01}
              name="price"
              placeholder="Price (CELO)"
              required
              onChange={(e) => setPrice(e.target.value)}
              value={price}
            />
          </div>
          <div className="flex flex-row justify-between items-center bg-gray-50 border rounded-xl mt-5">
            <textarea
              className="block w-full text-sm resize-none
                text-slate-500 bg-transparent border-0
                focus:outline-none focus:ring-0 h-20"
              type="text"
              name="description"
              placeholder="Description"
              required
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            ></textarea>
          </div>
          <button
            type="submit"
            className="flex flex-row justify-center items-center
              w-full text-white 
              font-semibold
              px-6 py-2 bg-white getstarted rounded-lg
              drop-shadow-xl border border-transparent
              focus:outline-none focus:ring mt-5"
          >
            {isMinting ? "Minting" : "Mint Now"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateNFT;

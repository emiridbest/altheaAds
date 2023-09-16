import React, { useState } from "react";

const pinataApiKey = "613752335d9bc9eef6c8";
const pinataSecretApiKey = "5f7ed7f24655581b7deef880b0f0e265c12231e01d1b47bc92d774ac834d40a3";

const AddNFTForm = ({ onAddNFT }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [pinataCID, setPinataCID] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const handleImageChange = async (e) => {
    try {
      setImageFile(e.target.files[0]);

      if (e.target.files[0]) {
        setIsUploading(true);
        const data = new FormData();
        data.append("file", e.target.files[0]);
        data.append(
          "pinataOptions",
          JSON.stringify({ wrapWithDirectory: false })
        );
        const response = await fetch(
          "https://api.pinata.cloud/pinning/pinFileToIPFS",
          {
            method: "POST",
            headers: {
              pinata_api_key: pinataApiKey,
              pinata_secret_api_key: pinataSecretApiKey,
            },
            body: data,
          }
        );

        console.log("Pinata API Response Status:", response.status);
        const responseData = await response.json();
        console.log("Pinata API Response Data:", responseData);

        if (!response.ok) {
          console.error("Error uploading to Pinata:", responseData.error);
          setIsUploading(false);
          return;
        }

        const newPinataCID = responseData.IpfsHash;
        setPinataCID(newPinataCID);
        setIsUploading(false);
      }
    } catch (error) {
      console.error("Error uploading to Pinata:", error);
      setIsUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddNFT({ name, description, pinataCID });
    setName("");
    setDescription("");
    setPinataCID("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <h2 className="nft">Add NFT</h2>
        </div>
        <div className="field">
          <label htmlFor="name">Name: </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="description">Description: </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="pinataCID">Pinata CID: </label>
          <input
            type="text"
            id="pinataCID"
            value={isUploading ? "Retrieving PinataCID..." : pinataCID}
            readOnly
          />
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="image"
        />
        <button
          type="submit"
          disabled={isUploading || !pinataCID}
          className="button"
        >
          Add NFT
        </button>
      </form>
    </div>
  );
};

export default AddNFTForm;

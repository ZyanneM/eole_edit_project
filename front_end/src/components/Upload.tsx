import React, { Component, ChangeEvent } from "react";
import axios from "axios";
import Toast from '../components/Toast/Toast'



interface UploadState {
  selectedFile: File | null;
  isUploaded: boolean;
  isFailUpload: boolean;
}




export default class Upload extends React.Component<any, UploadState> {
  private fileInputRef: React.RefObject<HTMLInputElement>;


  
  constructor(props: any) {
    super(props);
    this.state = {
      selectedFile: null,
      isUploaded: false,
      isFailUpload: false,
    };
    this.fileInputRef = React.createRef();
  }

  componentDidMount() {
    const fileNameSpan = document.getElementById("file-name");
    if (fileNameSpan) {
      fileNameSpan.innerText = "No file selected";
    }
  }

  handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    this.setState({ selectedFile });
    const fileNameSpan = document.getElementById("file-name");
    if (fileNameSpan) {
      fileNameSpan.innerText = selectedFile ? selectedFile.name : "No file selected";
    }
  };


  handleUploadClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const fileNameSpan = document.getElementById("file-name");
    event.preventDefault();
    const { selectedFile } = this.state;
    // Submit the file here
    console.log("Le fichier sélectionné est :", selectedFile);

    // const { pushToast } = useToasts();

    const formData = new FormData();
    formData.append("fileToUpload", selectedFile as Blob);
    


    try {
      const response = await axios.post("http://localhost:3000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
      this.setState({ isUploaded: true });
      if (fileNameSpan) {
        fileNameSpan.innerText = "";
      }
      setTimeout(() => {
        this.setState({ isUploaded: false });
        if (fileNameSpan) {
        fileNameSpan.innerText = "No file selected";
      }
      }, 3000);
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        this.setState({ isFailUpload: false });
        if (fileNameSpan) {
        fileNameSpan.innerText = "No file selected";
      }
      }, 3000);
      this.setState({ isFailUpload: true });
     
    }
  };

  handleSelectFileClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    this.fileInputRef.current?.click();
  };

  render() {
    const { selectedFile } = this.state;
    return (
  
      <div>
         {this.state.isFailUpload && (
        <Toast title="Sorry ❌" content="Fail to Upload file" type="danger" />
      )}
      {this.state.isUploaded ? (
        <Toast title="Congratulations 🎉" content="File Upload Successfully" type="success" />
      ) : null}
        <h1 className='upload-title'>💾 Upload your file</h1>
        <form className="upload-form">
          <input
            id="file-input"
            type="file"
            name="fileToUpload"
            style={{ display: "none" }}
            onChange={this.handleFileChange}
            ref={this.fileInputRef}
          />
          <button className="file-select-btn" onClick={this.handleSelectFileClick}>
            Select file
          </button>
          <span className="file-name" id="file-name"></span>
          <button
            className="upload-btn"
            type="submit"
            disabled={!selectedFile}
            onClick={this.handleUploadClick}
          >
            Upload my masterpiece 😎
          </button>
        </form>

      </div>

    );
  }
}

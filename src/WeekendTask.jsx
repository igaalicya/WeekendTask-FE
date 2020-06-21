import React from "react";
import Axios from "axios";
import { Table, Button, Modal, ModalHeader, ModalBody } from "reactstrap";

const API_URL = `http://localhost:8080`;

class WeekendTask extends React.Component {
  state = {
    selectedFile: null,
    moviesList: [],
    createForm: {
      nama: "",
      tahun: 0,
      description: "",
    },
    editForm: {
      id: 0,
      nama: "",
      tahun: 0,
      moviesPict: "",
      description: "",
    },

    modalOpen: false,
  };

  inputHandler = (e, field, form) => {
    let { value } = e.target;
    this.setState({
      [form]: {
        ...this.state[form],
        [field]: value,
      },
    });
  };

  fileChangeHandler = (e) => {
    this.setState({ selectedFile: e.target.files[0] });
  };

  getMovieList = () => {
    Axios.get(`${API_URL}/movies`)
      .then((res) => {
        this.setState({ moviesList: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  renderMoviesList = () => {
    return this.state.moviesList.map((val, idx) => {
      const { id, nama, tahun, moviesPict, description } = val;
      return (
        <>
          <tr>
            <td> {idx + 1} </td>
            <td> {nama} </td>
            <td> {tahun} </td>
            <td>
              <img
                style={{ objectFit: "contain", width: "60px" }}
                src={moviesPict}
                alt=""
              />
            </td>
            <td> {description} </td>
            <td>
              <input
                type="button"
                value="Edit"
                onClick={() => this.editBtnHandler(idx)}
              />
              <input
                type="button"
                value="Delete"
                onClick={() => this.deleteHandler(id)}
              />
            </td>
          </tr>
        </>
      );
    });
  };

  addMoviesHandler = () => {
    let formData = new FormData();

    formData.append(
      "file",
      this.state.selectedFile,
      this.state.selectedFile.name
    );
    formData.append("moviesData", JSON.stringify(this.state.createForm));

    Axios.post(`${API_URL}/movies/addMovies`, formData)
      .then((res) => {
        this.getMovieList();
        alert("film berhasil ditambahkan");
      })
      .catch((err) => {
        alert("film gagal ditambahkan");
        console.log(err);
      });

    console.log(this.state.createForm);
    console.log(JSON.stringify(this.state.createForm));
  };

  editBtnHandler = (idx) => {
    this.setState({
      editForm: {
        ...this.state.moviesList[idx],
      },
      modalOpen: true,
    });
  };

  editMoviesHandler = () => {
    let formData = new FormData();

    formData.append(
      "file",
      this.state.selectedFile,
      this.state.selectedFile.name
    );
    formData.append("moviesData", JSON.stringify(this.state.editForm));
    Axios.put(`${API_URL}/movies/edit/${this.state.editForm.id}`, formData)
      .then((res) => {
        alert("film berhasil diedit");
        this.setState({ modalOpen: false });
        this.getMovieList();
      })
      .catch((err) => {
        alert("film gagal diedit ");
        console.log(err);
      });
  };

  deleteHandler = (id) => {
    Axios.delete(`${API_URL}/movies/delete/${id}`)
      .then((res) => {
        console.log(res);
        this.getMovieList();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  toggleModal = () => {
    this.setState({ modalOpen: !this.state.modalOpen });
  };

  componentDidMount() {
    this.getMovieList();
  }

  render() {
    return (
      <div className="container">
        <h4>Tambah Film Baru</h4>
        <h5>Nama Film</h5>
        <input
          type="text"
          onChange={(e) => this.inputHandler(e, "nama", "createForm")}
        />
        <h5>Tahun</h5>
        <input
          type="text"
          onChange={(e) => this.inputHandler(e, "tahun", "createForm")}
        />
        <h5>Deskripsi</h5>
        <input
          type="text"
          onChange={(e) => this.inputHandler(e, "description", "createForm")}
        />
        <h5>Poster Film</h5>
        <input
          className="justify-content-center"
          type="file"
          onChange={this.fileChangeHandler}
        />
        <div>
          <input
            className="mt-4"
            type="button"
            value="Tambah Film"
            onClick={this.addMoviesHandler}
          />
        </div>
        <div className="mt-5 justify-content-center">
          <Table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Nama Film</th>
                <th>Tahun</th>
                <th>Poster Film</th>
                <th>Deskripsi</th>
                <th colSpan={2}>Action</th>
              </tr>
            </thead>
            <tbody>{this.renderMoviesList()}</tbody>
          </Table>
        </div>
        <Modal
          toggle={this.toggleModal}
          isOpen={this.state.modalOpen}
          className="edit-modal"
        >
          <ModalHeader toggle={this.toggleModal}>
            <caption>
              <h3>Edit Film</h3>
            </caption>
          </ModalHeader>
          <ModalBody>
            <div className="row">
              <div className="col-12">
                <input
                  type="text"
                  className="custom-text-input h-100 pl-3"
                  value={this.state.editForm.nama}
                  placeholder="Nama Film"
                  onChange={(e) => this.inputHandler(e, "nama", "editForm")}
                />
              </div>
              <div className="col-12 mt-3">
                <input
                  type="text"
                  className="custom-text-input h-100 pl-3"
                  value={this.state.editForm.tahun}
                  placeholder="Tahun"
                  onChange={(e) => this.inputHandler(e, "tahun", "editForm")}
                />
              </div>
              <div className="col-12 mt-3">
                <input
                  type="file"
                  className="custom-text-input h-100 pl-3"
                  // value={this.state.editForm.moviesPict}
                  placeholder="Poster Film"
                  onChange={this.fileChangeHandler}
                  // onChange={(e) =>
                  //   this.inputHandler(e, "moviesPict", "editForm")
                  // }
                />
              </div>
              <div className="col-12 mt-3">
                <textarea
                  value={this.state.editForm.description}
                  onChange={(e) =>
                    this.inputHandler(e, "description", "editForm")
                  }
                  style={{ resize: "none" }}
                  placeholder="Description"
                  className="custom-text-input"
                ></textarea>
              </div>
              <div className="col-5 mt-5 offset-1">
                <Button
                  className="w-100"
                  onClick={this.toggleModal}
                  type="outlined"
                >
                  Cancel
                </Button>
              </div>
              <div className="col-5 mt-5">
                <Button
                  className="w-100"
                  onClick={this.editMoviesHandler}
                  type="contained"
                >
                  Save
                </Button>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default WeekendTask;

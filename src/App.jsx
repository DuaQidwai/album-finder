import "./App.css";
import {
  FormControl,
  InputGroup,
  Container,
  Button,
  Card,
  Row,
} from "react-bootstrap";
import { useState, useEffect } from "react";

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);

  // Get token from Netlify function instead of exposing client_secret
  useEffect(() => {
    fetch("/.netlify/functions/getSpotifyToken")
      .then((res) => res.json())
      .then((data) => setAccessToken(data.access_token))
      .catch((err) => console.error("Error fetching token:", err));
  }, []);

  async function search() {
    if (!accessToken) return;

    let artistParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    };

    // Get Artist
    const artistID = await fetch(
      `https://api.spotify.com/v1/search?q=${searchInput}&type=artist`,
      artistParams
    )
      .then((result) => result.json())
      .then((data) => {
        if (!data.artists.items.length) return null;
        return data.artists.items[0].id;
      });

    if (!artistID) {
      alert("No artist found");
      return;
    }

    // Get Artist Albums
    await fetch(
      `https://api.spotify.com/v1/artists/${artistID}/albums?include_groups=album&market=US&limit=50`,
      artistParams
    )
      .then((result) => result.json())
      .then((data) => {
        setAlbums(data.items || []);
      });
  }

  return (
    <>
      <Container>
        <InputGroup>
          <FormControl
            placeholder="Search For Artist"
            type="input"
            aria-label="Search for an Artist"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                search();
              }
            }}
            onChange={(event) => setSearchInput(event.target.value)}
            style={{
              width: "300px",
              height: "35px",
              borderWidth: "0px",
              borderStyle: "solid",
              borderRadius: "5px",
              marginRight: "10px",
              paddingLeft: "10px",
            }}
          />
          <Button onClick={search}>Search</Button>
        </InputGroup>
      </Container>

      <Container>
        <Row
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-around",
            alignContent: "center",
          }}
        >
          {albums.map((album) => (
            <Card
              key={album.id}
              style={{
                backgroundColor: "white",
                margin: "10px",
                borderRadius: "5px",
                marginBottom: "30px",
              }}
            >
              <Card.Img
                width={200}
                src={album.images[0]?.url}
                style={{
                  borderRadius: "4%",
                }}
              />
              <Card.Body>
                <Card.Title
                  style={{
                    whiteSpace: "wrap",
                    fontWeight: "bold",
                    maxWidth: "200px",
                    fontSize: "18px",
                    marginTop: "10px",
                    color: "black",
                  }}
                >
                  {album.name}
                </Card.Title>
                <Card.Text style={{ color: "black" }}>
                  Release Date: <br /> {album.release_date}
                </Card.Text>
                <Button
                  href={album.external_urls.spotify}
                  style={{
                    backgroundColor: "black",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "15px",
                    borderRadius: "5px",
                    padding: "10px",
                  }}
                >
                  Album Link
                </Button>
              </Card.Body>
            </Card>
          ))}
        </Row>
      </Container>
    </>
  );
}

export default App;

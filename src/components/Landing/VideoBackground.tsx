import {styled} from "styled-components";

const VideoBackground = ({
  source
} : {
  source: string
}) => {
  return (
    <Container>
      <video autoPlay muted loop playsInline>
        <source src={source} type="video/mp4" />
        {/* Add additional source elements for different video formats */}
      </video>
    </Container>
  );
};

export default VideoBackground;

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1; /* Set the z-index to a negative value to place it behind other content */

  video {
    object-fit: cover; /* Make the video cover the entire background */
    width: 100%;
    height: 100%;
  }
`;
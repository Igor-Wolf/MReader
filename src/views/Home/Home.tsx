import { Text } from "react-native";
import { Container } from "./Styles";
import * as cheerio from 'cheerio';
import { useEffect, useState } from "react";




export default function Home() {


const [title, setTitle] = useState('');

  useEffect(() => {


    const html = `
      <html>
        <body>
          <h1>Hello, Cheerio!</h1>
          <p>Este é um teste.</p>
        </body>
      </html>
    `;

    const $ = cheerio.load(html);
    const h1Text = $('h1').text(); // pega o texto do <h1>

    setTitle(h1Text);
  }, []);




  return (
    <>
      <Container>
        <Text>{title}</Text>
      </Container>
    </>
  );
}

# 1dv527 Assignment 3 - Project

## Vad?

Min webthing är en [Raspberry Pi model 3B+](https://www.raspberrypi.org/products/raspberry-pi-3-model-b-plus/) med en [Sense HAT](https://www.raspberrypi.org/products/sense-hat/) kopplad till den som mäter temperatur, luftfuktighet, lufttryck, och har en LED-panel som man kan skicka data (meddelanden) till. Thingen läser av omgivningen var 10e sekund och skriver data till modellen. Klienter som är uppkopplade mot websocket-servern får data pushat till sig för respektive resurs de är uppkopplade mot. Man kan med hjälp av en API-nyckel (hårdkodad i klienten för att spara tid) POSTa meddelanden som visas på Thingens LED.

## Hur?

### Klient

url: https://webthing.weo.se

### Server

url: https://17335f4a.ngrok.io

Går till tunnel till server på mitt lokala nätverk hemma. Bör ligga uppe - om inte så skicka meddelande på slack så uppdaterar jag allt snabbt!

### Teknisk lösning / stack

Jag använder "Direct Integration Pattern" där min "Thing" kör en Node-applikation som dels exponerar en http-server, dels en websocket-server, dels kommunicerar med min Thing genom att köra python-script.

Klienten är en generellt skriven klient i React som ska fungera med alla typer av Webthings som följer [the Web Thing Model](http://model.webofthings.io). Det enda som är "hårdkodat" i klienten är root-url för min Thing, men även det skulle kunna gå att lösa så att man ger klienten en url på valfritt vis.

## Motivering

Servern (layers 1: Access och 2: Find) följer [the Web Thing Model](http://model.webofthings.io) (inkl requirements) genom att jag dels tagit JSON-filen som finns på bokens [GitHub-repo](https://github.com/webofthings/webofthings.js.git) och anpassat den efter min Thing, dels gått genom alla MUST och SHOULD i requirements och tror mig åtminstone ha implementerat alla MUST och några SHOULD (något som för övrigt exempel-koden i bokens repo inte gör!). Några exempel:

- JSON som default representation.
- Root-url som returnerar både en Link-header samt länkar i JSON till alla resurser enligt modellen. Link-header i alla 200-responses, och i JSON i de fall det är tillämpligt.
- HTTPS
- Websocket som automatiskt uppgraderar connection och skapar en prenumeration på den resource man requestar med en GET
- 201 med en Location-header när man skapar en Action.
- Lämpliga statuskoder, ffa 200, 201, 204, 400, 401, 404, 500.
- Actions hanteras korrekt där en action först får status 'pending', sedan 'executing' när den körs, och sedan 'completed' eller 'failed' när den kört klart eller misslyckats. Eftersom meddelandet körs som en rullande slinga som tar några sekunder så skapas en kö om flera klienter skickar meddelanden innan det senaste meddelandet kört klart.

Klienten är skriven för att kunna användas på vilken webthing som helst som följer The Web Thing Model, vilket löser layers 1 Access och 2 Find. För att verkligen göra klienten generell utan hårdkodade värden har jag valt att skriva den i TypeScript med typer/interface som följer standaderna i the Web Thing Model. Det innebär t.ex. att jag dels inte hårdkodat några URI, men inte heller t.ex. vilken typ av input en action behöver, utan klienten listar ut det med hjälp av Thingens api. Jag testade klienten på bokens [exempel-server](http://gateway.webofthings.io) och det fungerade faktiskt hyfsat bra - jag var dock tvungen att trixa lite med klienten då deras server inte hade konfigurerat CORS korrekt.

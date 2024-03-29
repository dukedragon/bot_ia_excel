import WhatsApp from "whatsapp";
import { config } from "dotenv";config()


let number_id = process.env.WA_PHONE_NUMBER_ID
console.log(number_id)
const wa = new WhatsApp()
const recipient_number = "573226494906"
async function send_message()
{
    try{
        const sent_text_message = wa.messages.text( { "body" : "Hello world" }, recipient_number );

        await sent_text_message.then( ( res ) =>
        {
            console.log( res.rawResponse() );
        } );
    }
    catch( e )
    {
        console.log( JSON.stringify( e ) );
    }
}

send_message();
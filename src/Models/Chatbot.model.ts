import { SystemInstructions } from "../Constants/SystemInstrunctions.constant";
import { MessageType } from "../Enums/MessageType.enum";
import { SafetyCategory } from "../Enums/SafetyCategory.enum";
import { Threshold } from "../Enums/Threshold.enum";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, GenerativeModel, ChatSession } from '@google/generative-ai'

export class ChatbotModel{
    public apiKey: string = '';
    public messages: MessageModel[] = [];
    public safetySettings: SafetySettings[] = [];
    public systemInstructions: string = '';
    private genAI : GoogleGenerativeAI | null = null;
    private model: GenerativeModel | null = null;
    public chat: ChatSession | null = null;
    public generationConfig = {
        temperature: 0.8,
        topK: 0,
        topP: 0.95,
        maxOutputTokens: 10000,
    }
    constructor(
        public modelName: string
    ){
        this.safetySettings.push(new SafetySettings(SafetyCategory.HARM_CATEGORY_HARASSMENT, Threshold.BLOCK_MEDIUM_AND_ABOVE));
        this.safetySettings.push(new SafetySettings(SafetyCategory.HARM_CATEGORY_HATE_SPEECH, Threshold.BLOCK_MEDIUM_AND_ABOVE));
        this.safetySettings.push(new SafetySettings(SafetyCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, Threshold.BLOCK_MEDIUM_AND_ABOVE));
        this.safetySettings.push(new SafetySettings(SafetyCategory.HARM_CATEGORY_DANGEROUS_CONTENT, Threshold.BLOCK_MEDIUM_AND_ABOVE));
        this.systemInstructions = SystemInstructions.RPG_DEFAULT;        
    }


    public setSafetySettingLevel(safetyCategory: SafetyCategory, threshold: Threshold){
        this.safetySettings.forEach((safetySetting) => {
            if(safetySetting.safetyCategory === safetyCategory){
                safetySetting.threshold = threshold;
            }
        });
    }

    public addMessage(message: MessageModel){
        this.messages.push(message);
    }

    public clearMessages(){
        this.messages = [];
    }

    public addApiKey(apiKey: string){
        this.apiKey = apiKey;
    }

    public init(apiKey: string){
        this.apiKey = apiKey;
        this.genAI = new GoogleGenerativeAI(apiKey);

        const safetySettings = [
            {
              category: HarmCategory.HARM_CATEGORY_HARASSMENT,
              threshold: HarmBlockThreshold.BLOCK_NONE,
            },
            {
              category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
              threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
            },
            {
              category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
              threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
              category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
              threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
            },
          ];



        this.model = this.genAI.getGenerativeModel({ 
            model: this.modelName, 
            generationConfig: this.generationConfig,
            safetySettings: safetySettings,
            systemInstruction: this.systemInstructions
         });

        this.chat = this.model.startChat();
    }

}

export class MessageModel{
    public messageType: MessageType;
    constructor(
        public content: string, 
        public isBot: boolean, 
        public userName?: string
    ){
        //Se o conteúdo possuir #Opção então é um SelectOption, se possuir #Cont então é um Continue, senão é um EnterText
        if(content.includes('#Opção')){
            this.messageType = MessageType.SelectOption;
        }
        else if(content.includes('#Cont')){
            this.messageType = MessageType.Continue;
        }
        else if(content.includes('#Nome')){
            this.messageType = MessageType.SetName;
        }
        else 
            this.messageType = MessageType.EnterText;
    }
}

export class SafetySettings{
    constructor(
        public safetyCategory: SafetyCategory,
        public threshold: Threshold
    ){}
}
import { GoogleGenerativeAI } from "@google/generative-ai";

export default class aiService {
    
    async getLesson(Category: string, subCategory: string, promptText: string): Promise<string> {
        
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `
        אתה מורה מקצועי ומנוסה. התפקיד שלך הוא ליצור שיעור מקיף ומעניין בעברית.
        
        קטגוריה: ${Category}
        תת-קטגוריה: ${subCategory}
         הנושא: ${promptText}

        מבנה השיעור הנדרש:
        1. הסבר מפורט וברור על הנושא.
        2. נקודות מפתח חשובות שצריך לזכור.
        3. סעיף "מקורות נוספים" שיכלול:
           - לפחות 2 קישורים ישירים לסרטוני יוטיוב רלוונטיים (כותרת ולינק).
           - 2-3 קישורים לאתרים לימודיים אמינים (כמו ויקיפדיה, אתרי מדע או היסטוריה).
        
        אנא נסח את כל התשובה בעברית רהוטה והשתמש בפורמט Markdown (כותרות, בולטים וקישורים לחיצים).
        `;
        try {
        const result = await model.generateContent(prompt);
        return await result.response.text();
    }   catch (error) {
        console.error("שגיאה בפנייה ל-AI של גוגל:", error);
        throw new Error("לא ניתן היה ליצור את השיעור כרגע.");
    }
}

    async getLessonMoke(Category: string, subCategory: string, promptText: string): Promise<string> {
        // אנחנו עושים "כאילו" אנחנו פונים ל-AI
        console.log(`Mocking lesson for: ${promptText}`);

        //  של המתנה לשרת (1.5 שניות)
        await new Promise(resolve => setTimeout(resolve, 1500));

        const mockResponse = `
            # שיעור בנושא: ${subCategory}
            ## קטגוריה: ${Category} 

            ### 1. הסבר על הנושא
            זהו הסבר מפורט ומקצועי על המושג **${promptText}**. בשיעור זה נלמד על המאפיינים העיקריים ועל החשיבות של הנושא בעולם המודרני. הטקסט כאן נוצר על ידי ה-Mock כדי לעזור לך לעצב את דף התוצאה.

            ### 2. נקודות מפתח
            * **חשיבות:** הבנת היסודות היא המפתח להצלחה.
            * **יישום:** ניתן ליישם את הנלמד במגוון תחומים.
            * **סיכום:** תמיד כדאי לחזור על החומר פעם נוספת.

            ### 3. מקורות נוספים
            * **יוטיוב:** [מדריך וידאו בנושא ${subCategory}](https://www.youtube.com/results?search_query=${encodeURIComponent(subCategory)})
            * **ויקיפדיה:** [קרא עוד בויקיפדיה](https://he.wikipedia.org/wiki/${encodeURIComponent(promptText)})
                `;

        return mockResponse;
    }

}



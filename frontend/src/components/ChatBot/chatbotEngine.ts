/**
 * Rule-based Chatbot Engine
 * Appears LLM-driven but uses pattern matching and rules
 */

interface Message {
  text: string
  sender: 'user' | 'bot'
}

class ChatbotEngine {
  private context: { lastTopic?: string; userName?: string } = {}

  getResponse(userInput: string, conversationHistory: Message[]): string {
    const input = userInput.toLowerCase().trim()

    // Extract user name if mentioned
    if (input.match(/my name is (\w+)/) || input.match(/i'?m (\w+)/)) {
      const match = input.match(/(?:my name is |i'?m )(\w+)/)
      if (match) {
        this.context.userName = match[1]
        return `Nice to meet you, ${match[1]}! 👋 How can I help you with your shopping today?`
      }
    }

    // Greeting patterns
    if (this.matchesPattern(input, ['hello', 'hi', 'hey', 'greetings'])) {
      const responses = [
        `Hello${this.context.userName ? ` ${this.context.userName}` : ''}! 👋 Welcome to our store. I'm here to help you find the perfect products. What are you looking for today?`,
        `Hi there! 😊 Thanks for stopping by. Are you looking for laptops, smartphones, or accessories?`,
        `Hey! Great to see you. I can help you with product recommendations, check stock, or answer questions. What interests you?`,
      ]
      return this.randomResponse(responses)
    }

    // Goodbye patterns
    if (this.matchesPattern(input, ['bye', 'goodbye', 'see you', 'later'])) {
      const responses = [
        `Goodbye! Thanks for chatting with me. Happy shopping! 🛍️`,
        `See you later! Feel free to come back if you need any help. 👋`,
        `Thanks for visiting! Have a great day! 😊`,
      ]
      return this.randomResponse(responses)
    }

    // Thank you patterns
    if (this.matchesPattern(input, ['thank', 'thanks', 'appreciate'])) {
      const responses = [
        `You're very welcome! 😊 Is there anything else I can help you with?`,
        `Happy to help! Let me know if you need anything else.`,
        `My pleasure! Feel free to ask if you have more questions.`,
      ]
      return this.randomResponse(responses)
    }

    // Product search - Laptops
    if (this.matchesPattern(input, ['laptop', 'notebooks', 'computer'])) {
      this.context.lastTopic = 'laptops'
      return `We have excellent laptops! 💻\n\n• **Professional Laptop Pro 15**: High-performance with 32GB RAM, 4K display - $1,899.99 (On Sale! Was $2,299.99)\n• **SlimBook Air 13**: Ultra-portable, 18-hour battery - $999.99\n\nWould you like more details about any of these?`
    }

    // Product search - Phones
    if (this.matchesPattern(input, ['phone', 'smartphone', 'mobile', 'cell'])) {
      this.context.lastTopic = 'phones'
      return `Check out our flagship smartphone! 📱\n\n• **UltraPhone X1**: 6.7\" AMOLED, 108MP camera, 5G - Starting at $1,199.99\n\nAvailable in Midnight Black, Ocean Blue, and Pearl White. Interested in learning more?`
    }

    // Product search - Headphones/Accessories
    if (this.matchesPattern(input, ['headphone', 'earphone', 'audio', 'accessory', 'accessories'])) {
      this.context.lastTopic = 'accessories'
      return `Great choice! 🎧 Check out these accessories:\n\n• **Premium Noise Cancelling Headphones**: 30-hour battery, ANC - $349.99 (On Sale from $399.99)\n\nWould you like to know about other accessories?`
    }

    // Price inquiry
    if (this.matchesPattern(input, ['price', 'cost', 'how much', 'expensive', 'cheap'])) {
      return `I'd be happy to help with pricing! 💰\n\nOur products range from $349.99 to $2,199.99:\n\n• **Budget-friendly**: Headphones at $349.99\n• **Mid-range**: Laptops from $999.99\n• **Premium**: Pro laptops up to $2,199.99\n\nMany items are on sale right now! What's your budget range?`
    }

    // Stock/Availability
    if (this.matchesPattern(input, ['stock', 'available', 'in stock', 'availability'])) {
      return `Good news! ✅ All our featured products are currently in stock:\n\n• Laptops: 45-65 units available\n• Smartphones: 120 units available\n• Headphones: 85 units available\n\nWhich product would you like to check specifically?`
    }

    // Shipping
    if (this.matchesPattern(input, ['ship', 'delivery', 'shipping', 'deliver'])) {
      return `📦 **Shipping Information:**\n\n✅ **FREE shipping** on orders over $50\n✅ Standard delivery: 3-5 business days\n✅ Express available: 1-2 business days\n✅ International shipping available\n\nAll orders are trackable. Need anything else?`
    }

    // Returns
    if (this.matchesPattern(input, ['return', 'refund', 'exchange'])) {
      return `🔄 **Return Policy:**\n\n✅ 30-day return window\n✅ Free returns on all items\n✅ Full refund or exchange\n✅ Easy return process\n\nYour satisfaction is our priority! Any other questions?`
    }

    // Warranty
    if (this.matchesPattern(input, ['warranty', 'guarantee'])) {
      return `🛡️ **Warranty Coverage:**\n\n• Laptops: 1-2 year manufacturer warranty\n• Smartphones: Standard manufacturer warranty\n• Accessories: 1 year warranty\n\nExtended protection plans available! Want to know more?`
    }

    // Recommendations
    if (this.matchesPattern(input, ['recommend', 'suggestion', 'best', 'top', 'popular'])) {
      return `⭐ **Top Recommendations:**\n\n1. **Professional Laptop Pro 15** - Best for power users (On Sale!)\n2. **UltraPhone X1** - Our #1 selling smartphone\n3. **Premium NC Headphones** - Perfect for travel\n\nAll highly rated by customers! Which category interests you most?`
    }

    // Comparison
    if (this.matchesPattern(input, ['compare', 'difference', 'versus', 'vs'])) {
      return `I can help you compare products! 🔍\n\nWhat would you like to compare? For example:\n• "Compare laptops"\n• "Difference between phones"\n• "Which is better for..."\n\nJust let me know!`
    }

    // Features
    if (this.matchesPattern(input, ['feature', 'spec', 'specification', 'detail'])) {
      if (this.context.lastTopic === 'laptops') {
        return `💻 **Laptop Specifications:**\n\n**Pro 15**: Intel i7, 32GB RAM, 4K OLED, RTX 3060\n**Air 13**: Intel i5, 16GB RAM, Retina display, ultra-portable\n\nNeed more detailed specs?`
      }
      return `I'd love to share detailed specifications! Which product are you interested in?\n\n• Laptops\n• Smartphones\n• Accessories`
    }

    // Help/Support
    if (this.matchesPattern(input, ['help', 'support', 'assist', 'question'])) {
      return `I'm here to help! 🤝 I can assist with:\n\n• Product recommendations\n• Specifications and features\n• Pricing and availability\n• Shipping and returns\n• Comparisons\n\nWhat would you like to know?`
    }

    // Default fallback with context
    const fallbacks = [
      `That's an interesting question! Let me help you find what you need. Are you looking for laptops, smartphones, or accessories?`,
      `I want to make sure I understand correctly. Could you tell me more about what you're looking for?`,
      `Great question! To give you the best answer, are you interested in our laptops, phones, or accessories?`,
      `I'm here to help! Feel free to ask about:\n• Product details\n• Prices and availability\n• Shipping info\n• Or browse our categories!\n\nWhat interests you?`,
    ]

    return this.randomResponse(fallbacks)
  }

  private matchesPattern(input: string, patterns: string[]): boolean {
    return patterns.some(pattern => input.includes(pattern))
  }

  private randomResponse(responses: string[]): string {
    return responses[Math.floor(Math.random() * responses.length)]
  }

  resetContext() {
    this.context = {}
  }
}

export const chatbotEngine = new ChatbotEngine()

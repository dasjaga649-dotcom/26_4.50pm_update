import React, { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import './App.css';

// Configure marked to return strings synchronously
marked.setOptions({
  async: false
});

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
  response?: BotResponse;
  query?: string; // Store the original user question for bot messages
}

interface BotResponse {
  answer: string;
  related_content?: RelatedContent[];
  recommendations?: string[];
  file_links?: FileLink[];
  tables?: Table[];
}

interface RelatedContent {
  image?: string;
  title: string;
  url: string;
}

interface FileLink {
  title: string;
  url: string;
}

interface Table {
  title: string;
  headers: string[];
  rows: string[][];
}

interface QuestionCard {
  icon: string;
  title: string;
  description: string;
  category: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I am your AI assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState<'client' | 'chat'>('client');
  const [isSearching, setIsSearching] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [searchInitiated, setSearchInitiated] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (currentPage === 'chat') {
      const scrollToBottom = () => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth'
        });
      };
      // Small delay to ensure DOM is updated
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, currentPage]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const questionCards: QuestionCard[] = [
    {
      icon: '👤',
      title: 'Founder/CEO',
      description: 'Who is the founder/who is the CEO?',
      category: 'About'
    },
    {
      icon: '🏢',
      title: 'Offices',
      description: 'Where are our offices?',
      category: 'Location'
    },
    {
      icon: '⚙️',
      title: 'Services',
      description: 'What services do we provide?',
      category: 'Services'
    },
    {
      icon: '��',
      title: 'Industries',
      description: 'What industries do we serve?',
      category: 'Industries'
    },
    {
      icon: '📊',
      title: 'Stats',
      description: 'What are some impressive stats about Hutech?',
      category: 'Statistics'
    },
    {
      icon: '🏆',
      title: 'Certifications',
      description: 'What certifications do we have?',
      category: 'Qualifications'
    },
    {
      icon: '💻',
      title: 'Tech Stack',
      description: 'What is our tech stack?',
      category: 'Technology'
    },
    {
      icon: '📞',
      title: 'Contact',
      description: 'Give me your contact details.',
      category: 'Contact'
    }
  ];

  const sendMessage = async (query?: string) => {
    const messageText = query || inputValue.trim();
    if (!messageText || isTransitioning) return;

    // Start the search transition animation
    setIsTransitioning(true);
    setSearchInitiated(true);

    // Wait for animations to complete before switching to chat page
    setTimeout(() => {
      setCurrentPage('chat');
      setIsSearching(true);
      setIsTransitioning(false);
    }, 1200); // 1.2s total animation duration

    const userMessage: Message = {
      id: Date.now(),
      text: messageText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

      // Mock response based on user query
      const botResponse = generateMockResponse(messageText);

      const botMessage: Message = {
        id: Date.now() + 1,
        text: botResponse.answer || "Thank you for your question! I'm here to help.",
        isUser: false,
        timestamp: new Date(),
        response: botResponse,
        query: messageText // Store the user's question
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "Sorry, I encountered an error while processing your request. Please try again.",
        isUser: false,
        timestamp: new Date(),
        query: messageText
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setTimeout(() => {
      sendMessage(suggestion);
    }, 100);
  };

  const handleCardClick = (card: QuestionCard) => {
    sendMessage(card.description);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        text: "Hello! I am your AI assistant. How can I help you today?",
        isUser: false,
        timestamp: new Date()
      }
    ]);
    setShowMenu(false);
  };

  const newChat = () => {
    setCurrentPage('client');
    setInputValue('');
    setShowMenu(false);
  };

  if (currentPage === 'client') {
    return (
      <div className={`client-page ${isTransitioning ? 'transitioning' : ''}`}>
        {/* Header */}
        <header className="client-header">
          <div className="header-content">
            <div className="logo-section">
              <img
                src="https://hutechsolutions.com/wp-content/uploads/2024/08/hutech-logo-1.svg"
                alt="Hutech Solutions"
                className="hutech-logo"
              />
              <img
                src="https://hutechsolutions.com/wp-content/uploads/2024/08/cmmi-level3-logo.svg"
                alt="CMMI Level 3"
                className="cmmi-logo"
              />
            </div>
            <nav className="nav-menu">
              <button className="nav-button active">Home</button>
              <button className="nav-button">Features</button>
              <button className="nav-button">Services</button>
              <button className="nav-button">About</button>
              <button className="nav-button">Contact</button>
              <button className="nav-button chat-nav-button">💬 Chat</button>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="client-main">
          <div className="welcome-section">
            <h1 className="welcome-title">
              Hello, this is an <span className="ai-text">AI assistant</span>!
            </h1>
            <p className="welcome-subtitle">
              I will help you find answers to your questions. Here are some examples:
            </p>
          </div>

          {/* Search Bar */}
          <div className={`client-search-container ${isTransitioning ? 'search-moving' : ''}`}>
            <form onSubmit={handleFormSubmit} className="client-search-form">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder="🎤 Ask me anything..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="client-search-input"
                  disabled={isTransitioning}
                />
                <button
                  type="submit"
                  className="search-send-button"
                  disabled={!inputValue.trim() || isTransitioning}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 713.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </button>
              </div>
            </form>
          </div>

          {/* Question Cards - Horizontal Scroll */}
          <div className={`question-cards-container ${isTransitioning ? 'cards-disappearing' : ''}`}>
            <div className="question-cards-scroll">
              {questionCards.map((card, index) => (
                <div
                  key={index}
                  className="question-card-horizontal"
                  onClick={() => handleCardClick(card)}
                >
                  <div className="card-icon">{card.icon}</div>
                  <div className="card-content">
                    <h3 className="card-title">{card.title}</h3>
                    <p className="card-description">{card.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Chat Page
  return (
    <div className={`bg-white body ${searchInitiated ? 'page-transition-enter-active' : ''} ${isSearching ? 'chat-searching' : ''}`} id='body'>
      {/* Chat History Panel */}
      <div id="chat-history" className="chat-history-container">
        {messages.map((message) => (
          <div key={message.id}>
            {message.isUser ? (
              <UserMessage text={message.text} />
            ) : (
              <BotMessage message={message} onSuggestionClick={handleSuggestionClick} />
            )}
          </div>
        ))}
        
        {isLoading && <LoadingMessage />}
      </div>

      {/* Chat Input Form with Menu */}
      <div className="sticky bottom-0 bg-white py-4">
        <div className="chat-search-container">
          <form id="chat-form" className="chat-search-form" onSubmit={handleFormSubmit}>
            <div className="chat-input-wrapper" ref={menuRef}>
              <input
                id="user-input"
                type="text"
                placeholder="🎤 Ask me anything..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoading}
                className={`chat-search-input ${isLoading ? 'searching' : ''}`}
              />

              {/* Three Dots Menu Inside Input */}
              <button
                type="button"
                onClick={() => setShowMenu(!showMenu)}
                className="chat-menu-button-inside"
              >
                <div className="three-dots-vertical">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              </button>

              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className={`chat-send-button ${isLoading ? 'searching' : ''}`}
              >
                {isLoading ? (
                  <div className="searching-animation">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                )}
              </button>

              {showMenu && (
                <div className="chat-menu-dropdown">
                  <button
                    onClick={newChat}
                    className="menu-item"
                  >
                    <div className="menu-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </div>
                    <span>New Chat</span>
                  </button>
                  <button
                    onClick={clearChat}
                    className="menu-item"
                  >
                    <div className="menu-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </div>
                  <span>Clear Chat</span>
                </button>
              </div>
            )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const UserMessage: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div className="flex justify-end">
      <div className="rounded-xl rounded-br-none p-4 shadow-md chat-bubble-user prose text-sm max-w-lg">
        <div dangerouslySetInnerHTML={{ __html: marked(text) as string }} />
      </div>
    </div>
  );
};

const MessageActions: React.FC<{
  message: Message;
}> = ({ message }) => {
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowExportDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const copyToClipboard = (text: string) => {
    return new Promise<void>((resolve, reject) => {
      // Try modern clipboard API first, but with proper error handling
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text)
          .then(() => resolve())
          .catch(() => {
            // If clipboard API fails, fall back to textarea method
            fallbackCopyTextToClipboard(text, resolve, reject);
          });
      } else {
        // Use fallback method directly
        fallbackCopyTextToClipboard(text, resolve, reject);
      }
    });
  };

  const fallbackCopyTextToClipboard = (text: string, resolve: () => void, reject: (err: any) => void) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;

    // Make the textarea out of viewport but still accessible
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.setAttribute('readonly', '');
    textArea.style.userSelect = 'text';

    document.body.appendChild(textArea);

    // Focus and select with better browser compatibility
    if (textArea.select) {
      textArea.focus();
      textArea.select();
    } else if (textArea.setSelectionRange) {
      textArea.focus();
      textArea.setSelectionRange(0, textArea.value.length);
    }

    try {
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);

      if (successful) {
        resolve();
      } else {
        // Final fallback: try selection API
        try {
          const selection = window.getSelection();
          const range = document.createRange();
          range.selectNodeContents(textArea);
          selection?.removeAllRanges();
          selection?.addRange(range);
          const copySuccess = document.execCommand('copy');
          selection?.removeAllRanges();

          if (copySuccess) {
            resolve();
          } else {
            reject(new Error('All copy methods failed'));
          }
        } catch (selectionError) {
          reject(new Error('Copy command and selection both failed'));
        }
      }
    } catch (err) {
      document.body.removeChild(textArea);
      reject(err);
    }
  };

  const handleCopy = () => {
    let textToCopy = '';

    // Add question (if available from message context)
    if (message.query) {
      textToCopy += `Question: ${message.query}\n\n`;
    }

    // Add answer in plain text
    const answerText = message.text?.replace(/<[^>]*>/g, '') || '';
    textToCopy += `Answer:\n${answerText}\n\n`;

    // Add related content images if available
    if (message.response?.related_content && message.response.related_content.length > 0) {
      const itemsWithImages = message.response.related_content.filter(item => item.image);
      if (itemsWithImages.length > 0) {
        textToCopy += 'Related Images:\n';
        itemsWithImages.forEach(item => {
          textToCopy += `${item.title}: ${item.image}\n`;
        });
        textToCopy += '\n';
      }
    }

    // Add file links if available
    if (message.response?.file_links && message.response.file_links.length > 0) {
      textToCopy += 'File Links:\n';
      message.response.file_links.forEach(link => {
        textToCopy += `${link.title}: ${link.url}\n`;
      });
      textToCopy += '\n';
    }

    // Add related content page URLs
    if (message.response?.related_content && message.response.related_content.length > 0) {
      textToCopy += 'Related Pages:\n';
      message.response.related_content.forEach(item => {
        textToCopy += `${item.title}: ${item.url}\n`;
      });
    }

    copyToClipboard(textToCopy)
      .then(() => {
        alert('Content copied to clipboard!');
      })
      .catch((err) => {
        console.error('Copy failed:', err);
        // Show the content in a modal or alert for manual copying
        const copyText = `Copy failed due to browser restrictions. Please manually copy this content:\n\n${textToCopy}`;
        alert(copyText);
      });
  };

  const handleShare = () => {
    const currentUrl = window.location.href;
    copyToClipboard(currentUrl)
      .then(() => {
        alert('URL copied to clipboard!');
      })
      .catch((err) => {
        console.error('Share failed:', err);
        // Show URL in a way that's easy to copy
        const shareText = `Share failed due to browser restrictions. Please manually copy this URL:\n\n${currentUrl}`;
        alert(shareText);
      });
  };

  const generatePDF = () => {
    try {
      // Create content for PDF with uploaded logo
      let content = '';

      // Add Hutech logo reference (uploaded image)
      content += 'HUTECH SOLUTIONS\n';
      content += 'Logo: https://cdn.builder.io/api/v1/image/assets%2F10441328364c47c595b473db8971cc31%2F1ba354186d5543baa8be89171a8f9823?format=webp&width=800\n';
      content += 'Connecting People and Technology\n\n';

      if (message.query) {
        content += `QUESTION: ${message.query}\n\n`;
      }

      const answerText = message.text?.replace(/<[^>]*>/g, '') || '';
      content += `ANSWER:\n${answerText}\n\n`;

      // Add related content images if available
      if (message.response?.related_content && message.response.related_content.length > 0) {
        content += 'RELATED IMAGES:\n';
        message.response.related_content.forEach(item => {
          if (item.image) {
            content += `${item.title}: ${item.image}\n`;
          }
        });
        content += '\n';
      }

      // Add file links
      if (message.response?.file_links && message.response.file_links.length > 0) {
        content += 'FILE LINKS:\n';
        message.response.file_links.forEach(link => {
          content += `${link.title}: ${link.url}\n`;
        });
        content += '\n';
      }

      // Add related content URLs
      if (message.response?.related_content && message.response.related_content.length > 0) {
        content += 'PAGE URLS:\n';
        message.response.related_content.forEach(item => {
          content += `${item.title}: ${item.url}\n`;
        });
      }

      // Create a simple text-based PDF substitute
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'hutech-response.txt';
      a.click();
      URL.revokeObjectURL(url);

      alert('Content downloaded as text file (PDF library not available in this environment)');
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('PDF export failed. Please try again.');
    }
  };

  const generateMarkdown = () => {
    try {
      let markdown = '';

      // Add Hutech logo (uploaded image)
      markdown += '![Hutech Solutions](https://cdn.builder.io/api/v1/image/assets%2F10441328364c47c595b473db8971cc31%2F1ba354186d5543baa8be89171a8f9823?format=webp&width=800)\n\n';
      markdown += '# Hutech Solutions\n';
      markdown += '*Connecting People and Technology*\n\n';
      markdown += '---\n\n';

      if (message.query) {
        markdown += `# ${message.query}\n\n`;
      }

      const answerText = message.text?.replace(/<[^>]*>/g, '') || '';
      markdown += `## Answer\n\n${answerText}\n\n`;

      // Add related content images
      if (message.response?.related_content && message.response.related_content.length > 0) {
        const itemsWithImages = message.response.related_content.filter(item => item.image);
        if (itemsWithImages.length > 0) {
          markdown += '## Related Images\n\n';
          itemsWithImages.forEach(item => {
            markdown += `### ${item.title}\n`;
            markdown += `![${item.title}](${item.image})\n\n`;
          });
        }
      }

      // Add file links
      if (message.response?.file_links && message.response.file_links.length > 0) {
        markdown += '## File Links\n\n';
        message.response.file_links.forEach(link => {
          markdown += `- [📄 ${link.title}](${link.url})\n`;
        });
        markdown += '\n';
      }

      // Add related content URLs
      if (message.response?.related_content && message.response.related_content.length > 0) {
        markdown += '## Related Pages\n\n';
        message.response.related_content.forEach(item => {
          markdown += `- [🔗 ${item.title}](${item.url})\n`;
        });
      }

      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'hutech-response.md';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Markdown generation failed:', error);
      alert('Markdown export failed. Please try again.');
    }
  };

  const generateDOCX = () => {
    try {
      // Create content for DOCX (using HTML format as fallback)
      let htmlContent = `
        <html>
          <head>
            <title>Hutech Solutions - Response</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
              h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
              h2 { color: #374151; margin-top: 30px; }
              h3 { color: #6b7280; }
              .logo { text-align: center; margin-bottom: 30px; }
              .tagline { text-align: center; font-style: italic; color: #6b7280; margin-bottom: 30px; }
              .content { margin: 20px 0; }
              .links { margin-top: 20px; }
              .links a { display: block; margin: 8px 0; padding: 5px; background: #f3f4f6; text-decoration: none; border-radius: 4px; }
              .links a:hover { background: #e5e7eb; }
              .images img { max-width: 100%; height: auto; margin: 10px 0; border: 1px solid #e5e7eb; border-radius: 8px; }
              hr { border: none; border-top: 1px solid #e5e7eb; margin: 30px 0; }
            </style>
          </head>
          <body>
            <div class="logo">
              <img src="https://cdn.builder.io/api/v1/image/assets%2F10441328364c47c595b473db8971cc31%2F1ba354186d5543baa8be89171a8f9823?format=webp&width=800" alt="Hutech Solutions" style="height: 80px;">
            </div>
            <div class="tagline">
              <strong>Connecting People and Technology</strong>
            </div>
            <hr>
      `;

      if (message.query) {
        htmlContent += `<h1>${message.query}</h1>`;
      }

      const answerText = message.text?.replace(/<[^>]*>/g, '') || '';
      htmlContent += `<div class="content"><h2>Answer</h2><p>${answerText}</p></div>`;

      // Add related content images
      if (message.response?.related_content && message.response.related_content.length > 0) {
        const itemsWithImages = message.response.related_content.filter(item => item.image);
        if (itemsWithImages.length > 0) {
          htmlContent += '<div class="images"><h2>Related Images</h2>';
          itemsWithImages.forEach(item => {
            htmlContent += `<h3>${item.title}</h3>`;
            htmlContent += `<img src="${item.image}" alt="${item.title}">`;
          });
          htmlContent += '</div>';
        }
      }

      // Add file links
      if (message.response?.file_links && message.response.file_links.length > 0) {
        htmlContent += '<div class="links"><h2>File Links</h2>';
        message.response.file_links.forEach(link => {
          htmlContent += `<a href="${link.url}" target="_blank">📄 ${link.title}</a>`;
        });
        htmlContent += '</div>';
      }

      // Add related content URLs
      if (message.response?.related_content && message.response.related_content.length > 0) {
        htmlContent += '<div class="links"><h2>Related Pages</h2>';
        message.response.related_content.forEach(item => {
          htmlContent += `<a href="${item.url}" target="_blank">🔗 ${item.title}</a>`;
        });
        htmlContent += '</div>';
      }

      htmlContent += '</body></html>';

      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'hutech-response.html';
      a.click();
      URL.revokeObjectURL(url);

      alert('Content downloaded as HTML file (DOCX library not available in this environment)');
    } catch (error) {
      console.error('DOCX generation failed:', error);
      alert('DOCX export failed. Please try again.');
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (isDisliked) setIsDisliked(false);
  };

  const handleDislike = () => {
    setIsDisliked(!isDisliked);
    if (isLiked) setIsLiked(false);
  };

  return (
    <div className="message-actions flex items-center justify-between px-4 py-2">
      {/* Left side: Share and Export */}
      <div className="flex items-center gap-2">
        {/* Share Button */}
        <button
          onClick={handleShare}
          className="action-button flex items-center gap-1 px-3 py-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors text-sm"
          title="Share URL"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
          </svg>
          Share
        </button>

        {/* Export Button with Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowExportDropdown(!showExportDropdown)}
            className="action-button flex items-center gap-1 px-3 py-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors text-sm"
            title="Export content"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-3 h-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>

          {showExportDropdown && (
            <div className="export-dropdown absolute left-0 top-full mt-1 bg-white rounded-md shadow-lg z-10 min-w-32">
              <button
                onClick={() => {
                  try {
                    generatePDF();
                    setShowExportDropdown(false);
                  } catch (error) {
                    console.error('PDF export error:', error);
                    alert('PDF export failed. Please try again.');
                  }
                }}
                className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                title="Export as PDF (text format)"
              >
                PDF
              </button>
              <button
                onClick={() => {
                  try {
                    generateMarkdown();
                    setShowExportDropdown(false);
                  } catch (error) {
                    console.error('Markdown export error:', error);
                    alert('Markdown export failed. Please try again.');
                  }
                }}
                className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                title="Export as Markdown"
              >
                Markdown
              </button>
              <button
                onClick={() => {
                  try {
                    generateDOCX();
                    setShowExportDropdown(false);
                  } catch (error) {
                    console.error('DOCX export error:', error);
                    alert('DOCX export failed. Please try again.');
                  }
                }}
                className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                title="Export as DOCX (HTML format)"
              >
                DOCX
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right side: Copy, Like, and Dislike */}
      <div className="flex items-center gap-2">
        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="action-button flex items-center gap-1 px-3 py-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors text-sm"
          title="Copy content"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
          </svg>
          Copy
        </button>

        {/* Like Button */}
        <button
          onClick={handleLike}
          className={`action-button flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors text-sm ${
            isLiked ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
          }`}
          title="Like"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill={isLiked ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.398.83 1.169 1.398 2.02 1.398h.716c.83 0 1.598-.481 1.998-1.25a.739.739 0 00.109-.376c0-.621-.504-1.125-1.125-1.125H9.375c-.621 0-1.125.504-1.125 1.125v.375M5.904 18.75L7.5 16.5H5.904z" />
          </svg>
        </button>

        {/* Dislike Button */}
        <button
          onClick={handleDislike}
          className={`action-button flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors text-sm ${
            isDisliked ? 'text-red-600 bg-red-50' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
          }`}
          title="Dislike"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill={isDisliked ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 rotate-180">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.398.83 1.169 1.398 2.02 1.398h.716c.83 0 1.598-.481 1.998-1.25a.739.739 0 00.109-.376c0-.621-.504-1.125-1.125-1.125H9.375c-.621 0-1.125.504-1.125 1.125v.375M5.904 18.75L7.5 16.5H5.904z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const BotMessage: React.FC<{
  message: Message;
  onSuggestionClick: (suggestion: string) => void;
}> = ({ message, onSuggestionClick }) => {
  const response = message.response;

  return (
    <div className="flex items-start justify-center">
      <div className="max-w-3xl w-full">
        
        {/* Related Content Card Carousel */}
        {response?.related_content && response.related_content.length > 0 && (
          <RelatedContentCarousel items={response.related_content} />
        )}

        {/* Main Answer */}
        {message.text && (
          <div className="p-4 rounded-xl prose text-gray-800">
            <div dangerouslySetInnerHTML={{
              __html: marked(renderIcons(renderTables(preprocessResponse(message.text), response?.tables || []))) as string
            }} />
          </div>
        )}

        {/* Action Buttons */}
        {message.text && (
          <MessageActions message={message} />
        )}

        {/* File Links */}
        {response?.file_links && response.file_links.length > 0 && (
          <FileLinksSection files={response.file_links} />
        )}

        {/* Suggested Questions */}
        {response?.recommendations && response.recommendations.length > 0 && (
          <SuggestionsSection 
            suggestions={response.recommendations} 
            onSuggestionClick={onSuggestionClick} 
          />
        )}
      </div>
    </div>
  );
};

const LoadingMessage: React.FC = () => {
  return (
    <div className="flex justify-start">
      <div className="rounded-xl rounded-bl-none p-4 shadow-md max-w-sm bg-white">
        <div className="flex space-x-2 animate-pulse">
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

const RelatedContentCarousel: React.FC<{ items: RelatedContent[] }> = ({ items }) => {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Function to validate if image URL is potentially valid
  const isValidImageUrl = (url: string): boolean => {
    if (!url || url === "No image found.") return false;
    try {
      const urlObj = new URL(url);
      // Basic validation: should be http/https and have common image extensions
      const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'];
      const hasValidExtension = validExtensions.some(ext =>
        urlObj.pathname.toLowerCase().includes(ext)
      );
      return (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') && hasValidExtension;
    } catch {
      return false;
    }
  };

  // Function to get favicon URL for a website
  const getFaviconUrl = (websiteUrl: string): string => {
    try {
      const urlObj = new URL(websiteUrl);
      const domain = urlObj.hostname;
      // Use Google's favicon service for reliable favicon fetching
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=16`;
    } catch {
      return '';
    }
  };

  const scrollLeft = () => {
    if (containerRef.current) {
      const scrollAmount = 200;
      containerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      const scrollAmount = 200;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial check
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div className="w-full mb-6">
      <h5 className="font-semibold text-gray-800 mb-2 px-4">Related content</h5>
      <div className="related-content-carousel-wrapper">
        <button
          onClick={scrollLeft}
          disabled={!canScrollLeft}
          className={`carousel-nav-button carousel-nav-left ${!canScrollLeft ? 'disabled' : ''}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        <div
          ref={containerRef}
          className="related-content-horizontal-container"
        >
          {items.map((item, index) => (
            <a
              key={index}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="related-content-mini-card"
            >
              <div className="mini-card-favicon">
                <img
                  src={getFaviconUrl(item.url)}
                  alt={`${new URL(item.url).hostname} favicon`}
                  className="favicon-image"
                  onError={(e) => {
                    // Replace with fallback icon if favicon fails
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div className="favicon-fallback" style={{ display: 'none' }}>
                  🔗
                </div>
              </div>
              <div className="mini-card-content">
                <div className="mini-card-hostname">
                  {new URL(item.url).hostname.replace('www.', '')}
                </div>
                <div className="mini-card-title">{item.title}</div>
              </div>
            </a>
          ))}
        </div>

        <button
          onClick={scrollRight}
          disabled={!canScrollRight}
          className={`carousel-nav-button carousel-nav-right ${!canScrollRight ? 'disabled' : ''}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const FileLinksSection: React.FC<{ files: FileLink[] }> = ({ files }) => {
  return (
    <div className="mt-6">
      <h5 className="font-semibold text-gray-800 mb-2 px-4">Files</h5>
      {files.map((file, index) => (
        <a 
          key={index}
          href={file.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 p-3 my-1 rounded-lg hover:bg-gray-100 transition-colors duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path d="M4 4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-5L9 4H4z" />
          </svg>
          <span className="text-sm font-medium text-gray-700">{file.title}</span>
        </a>
      ))}
    </div>
  );
};

const SuggestionsSection: React.FC<{
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
}> = ({ suggestions, onSuggestionClick }) => {
  const [clickedSuggestions, setClickedSuggestions] = useState<Set<string>>(new Set());

  const handleSuggestionClick = (suggestion: string) => {
    // Mark this suggestion as clicked
    setClickedSuggestions(prev => new Set(prev.add(suggestion)));
    // Call the original click handler
    onSuggestionClick(suggestion);
  };

  return (
    <div className="mt-6">
      <h5 className="font-semibold text-gray-800 mb-3 px-4">Suggested Questions</h5>
      <div className="px-4">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => handleSuggestionClick(suggestion)}
            className={`suggestion-button flex items-center justify-between w-full text-left text-sm ${
              clickedSuggestions.has(suggestion) ? 'clicked' : 'text-gray-700'
            }`}>
            <span>{suggestion}</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
};

// Utility functions
const renderTables = (answer: string, tables: Table[]): string => {
  if (!tables || tables.length === 0) {
    return answer;
  }

  let processedAnswer = answer;
  tables.forEach(table => {
    const placeholder = `[TABLE:${table.title}]`;
    if (processedAnswer.includes(placeholder)) {
      let tableHtml = `<div class="overflow-x-auto my-4">`;
      tableHtml += `<table class="min-w-full border border-gray-300 rounded-lg overflow-hidden shadow-sm">`;
      tableHtml += `<caption class="p-2 text-sm text-gray-500 font-medium text-left">${table.title}</caption>`;

      if (table.headers && table.headers.length > 0) {
        tableHtml += `<thead class="bg-gray-100">`;
        tableHtml += `<tr>${table.headers.map(h => `<th class="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">${h}</th>`).join('')}</tr>`;
        tableHtml += `</thead>`;
      }

      tableHtml += `<tbody class="divide-y divide-gray-200">`;
      table.rows.forEach(row => {
        tableHtml += `<tr class="bg-white">`;
        tableHtml += row.map(cell => `<td class="p-3 text-sm text-gray-800">${cell}</td>`).join('');
        tableHtml += `</tr>`;
      });
      tableHtml += `</tbody>`;
      tableHtml += `</table></div>`;

      processedAnswer = processedAnswer.replace(placeholder, tableHtml);
    }
  });

  return processedAnswer;
};

const getIconSVG = (iconName: string): string => {
  const icons: { [key: string]: string } = {
    location: `<svg xmlns="http://www.w3.org/2000/svg" class="inline-block w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/></svg>`,
    phone: `<svg xmlns="http://www.w3.org/2000/svg" class="inline-block w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2 6.5c1.5-2 4-3 6.5-2l2 2a1 1 0 010 1.4L9 10a12 12 0 005 5l2.1-1.5a1 1 0 011.4 0l2 2c1 2.5 0 5-2 6.5-.6.4-1.4.5-2.1.2C10.2 20.5 3.5 13.8 1.8 6.6c-.3-.7-.2-1.5.2-2.1z"/></svg>`,
    mobile: `<svg xmlns="http://www.w3.org/2000/svg" class="inline-block w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 1h-7a.5.5 0 00-.5.5v21a.5.5 0 00.5.5h7a.5.5 0 00.5-.5V1.5a.5.5 0 00-.5-.5zM12 22a1 1 0 110-2 1 1 0 010 2z"/></svg>`,
    email: `<svg xmlns="http://www.w3.org/2000/svg" class="inline-block w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h18a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7l9 6 9-6" /></svg>`
  };
  return icons[iconName] || '';
};

const renderIcons = (text: string): string => {
  return text.replace(/\[ICON:(.*?)]/g, (match, iconName) => {
    return `<span class="inline-block align-middle">${getIconSVG(iconName.trim())}</span>`;
  });
};

const preprocessResponse = (text: string): string => {
  let processedText = text.replace(/&nbsp;|\u00A0|\t/g, ' ');
  processedText = processedText.replace(/([^\n])---/g, '$1\n\n---\n\n');
  processedText = processedText.replace(/^(\s*)\*\s+/gm, '$1* ');
  processedText = processedText.replace(/^(#+)(?! )/gm, '$1 ');
  processedText = processedText.replace(/^(\s*>)(?! )/gm, '$1 ');
  return processedText.trim();
};

export default App;

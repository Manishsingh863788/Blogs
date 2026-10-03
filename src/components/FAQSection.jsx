import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Plus } from 'lucide-react';

export default function FAQSection({ faqs, isAdminLoggedIn, onAddFaqClick }) {
  const [openIndex, setOpenIndex] = useState(0);

  const hasFaqs = faqs && faqs.length > 0;

  if (!hasFaqs && !isAdminLoggedIn) return null;

  return (
    <div style={{ marginTop: '2.5rem', marginBottom: '2.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <HelpCircle size={22} color="var(--accent-primary)" />
          <h3 className="serif-heading" style={{ fontSize: '1.5rem', color: 'var(--text-main)', margin: 0 }}>
            Statutory FAQ & Legal Clarifications
          </h3>
        </div>

        {isAdminLoggedIn && onAddFaqClick && (
          <button 
            onClick={onAddFaqClick}
            className="btn-primary"
            style={{ fontSize: '0.82rem', padding: '0.45rem 0.9rem', gap: '4px' }}
          >
            <Plus size={15} /> Add FAQ
          </button>
        )}
      </div>

      {hasFaqs ? (
        <div>
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="faq-item">
                <div 
                  className="faq-header"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                >
                  <span style={{ color: isOpen ? 'var(--accent-primary)' : 'var(--text-main)', fontSize: '1rem' }}>
                    {faq.question}
                  </span>
                  <ChevronDown 
                    size={20} 
                    style={{ 
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.25s ease',
                      color: isOpen ? 'var(--accent-primary)' : 'var(--text-muted)'
                    }} 
                  />
                </div>

                {isOpen && (
                  <div className="faq-body">
                    <p style={{ margin: '0.75rem 0 0 0', lineHeight: 1.7 }}>
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', border: '1px dashed var(--border-color)', borderRadius: '12px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          No FAQs published for this article yet. Click "Add FAQ" above to add the first FAQ item.
        </div>
      )}
    </div>
  );
}

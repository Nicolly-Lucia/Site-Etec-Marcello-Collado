/**
 * main.js — Validação client-side para o formulário de contato da Etec
 * O formulário faz POST para formulario.php
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Referências ──────────────────────────────────────── */
  const form      = document.querySelector('form');
  const mensagem  = document.querySelector('textarea[name="mensagem"]');
  const telefone  = document.querySelector('input[name="telefone"]');
  const submitBtn = document.querySelector('.btn-enviar');

  const MAX_CHARS = 500;

  /* ── Criar elementos de feedback se não existirem ───── */
  function criarFeedback(campo) {
    const parent = campo.parentElement;
    let errEl = parent.querySelector('.erro-feedback');
    if (!errEl) {
      errEl = document.createElement('span');
      errEl.className = 'erro-feedback';
      errEl.style.cssText = 'color: #dc3545; font-size: 0.8rem; display: block; margin-top: 5px;';
      parent.appendChild(errEl);
    }
    return errEl;
  }

  /* ── Contador de caracteres ───────────────────────────── */
  if (mensagem) {
    // Criar contador abaixo do textarea
    const parent = mensagem.parentElement;
    let countEl = document.getElementById('charCount');
    if (!countEl) {
      countEl = document.createElement('span');
      countEl.id = 'charCount';
      countEl.style.cssText = 'display: block; font-size: 0.8rem; color: #5a6a7a; margin-top: 5px;';
      parent.appendChild(countEl);
    }

    // Atualizar contador e limitar caracteres
    mensagem.addEventListener('input', () => {
      let len = mensagem.value.length;
      
      // Se passar de 500, corta o texto
      if (len > MAX_CHARS) {
        mensagem.value = mensagem.value.slice(0, MAX_CHARS);
        len = MAX_CHARS;
      }
      
      countEl.textContent = `${len} / ${MAX_CHARS}`;
      countEl.style.color = len >= 400 ? (len >= MAX_CHARS ? '#dc3545' : '#e67e22') : '#5a6a7a';
    });
  }

  /* ── Máscara de telefone ──────────────────────────────── */
  if (telefone) {
    telefone.addEventListener('input', () => {
      let v = telefone.value.replace(/\D/g, '');
      if (v.length > 11) v = v.slice(0, 11);
      if (v.length > 10) {
        v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
      } else if (v.length > 6) {
        v = v.replace(/^(\d{2})(\d{4})(\d+)$/, '($1) $2-$3');
      } else if (v.length > 2) {
        v = v.replace(/^(\d{2})(\d+)$/, '($1) $2');
      }
      telefone.value = v;
    });
  }

  /* ── Regras de validação ──────────────────────────────── */
  const rules = {
    nome:     v => !v.trim() ? 'Nome é obrigatório.'
                : v.trim().length < 3 ? 'Digite ao menos 3 caracteres.' : '',
    email:    v => !v.trim() ? 'E-mail é obrigatório.'
                : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? 'Informe um e-mail válido.' : '',
    telefone: v => {
      const numeros = v.replace(/\D/g, '');
      return v.trim() && numeros.length < 10 ? 'Telefone incompleto.' : '';
    },
    mensagem: v => {
      if (!v.trim()) return 'Mensagem é obrigatória.';
      if (v.trim().length < 10) return 'Mínimo de 10 caracteres.';
      if (v.trim().length > MAX_CHARS) return `Máximo de ${MAX_CHARS} caracteres.`;
      return '';
    },
  };

  /* ── Aplica / limpa estado visual de um campo ─────────── */
  function setFieldState(el, msg) {
    const errEl = criarFeedback(el);
    el.style.borderColor = msg ? '#dc3545' : '#28a745';
    el.style.boxShadow = msg ? '0 0 0 3px rgba(220, 53, 69, 0.1)' : '0 0 0 3px rgba(40, 167, 69, 0.1)';
    if (errEl) errEl.textContent = msg || '';
    return !msg;
  }

  /* ── Valida ao sair do campo ──────────────────────────── */
  ['nome', 'email', 'telefone', 'mensagem'].forEach(name => {
    const el = document.querySelector(`input[name="${name}"], textarea[name="${name}"]`);
    if (!el) return;
    el.addEventListener('blur', () => {
      const msg = rules[name] ? rules[name](el.value) : '';
      setFieldState(el, msg);
    });
    // Limpa erro ao digitar
    el.addEventListener('input', () => {
      const msg = rules[name] ? rules[name](el.value) : '';
      if (msg) {
        setFieldState(el, msg);
      } else {
        // Se não tiver erro, limpa o estado de erro
        const errEl = criarFeedback(el);
        el.style.borderColor = '';
        el.style.boxShadow = '';
        if (errEl) errEl.textContent = '';
      }
    });
  });

  /* ── Valida tudo antes de submeter ───────────────────── */
  function validateAll() {
    let ok = true;
    const fields = ['nome', 'email', 'telefone', 'mensagem'];
    
    fields.forEach(name => {
      const el = document.querySelector(`input[name="${name}"], textarea[name="${name}"]`);
      if (!el) return;
      const msg = rules[name] ? rules[name](el.value) : '';
      if (!setFieldState(el, msg)) ok = false;
    });

    return ok;
  }

  /* ── Submit: valida e deixa o browser fazer o POST ───── */
  if (form) {
    form.addEventListener('submit', e => {
      if (!validateAll()) {
        e.preventDefault(); // bloqueia se inválido
        const firstError = form.querySelector('.is-error');
        if (firstError) firstError.focus();
        return;
      }
      // Se válido: mostra loader e deixa o POST seguir normalmente
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
        submitBtn.style.opacity = '0.7';
        submitBtn.style.cursor = 'not-allowed';
      }
    });
  }

});
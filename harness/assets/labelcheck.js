/* 소제목 말투 검사: 계산형 센서 예시 (정규식 규칙 묶음) */
(function(){
  const RULES = [
    {id:'q-mark',   re:/\?\s*$/,                                   why:'물음표로 끝나는 질문형'},
    {id:'q-end',    re:/(나|까|니|냐)\s*$/,                          why:'의문형 어미(-나/-까/-니)로 끝남'},
    {id:'polite',   re:/(요|죠)\s*$/,                                why:'구어체 종결(-요/-죠)'},
    {id:'decl',     re:/다\.?\s*$/,                                  why:'서술형 종결(-다)'},
    {id:'cond',     re:/면\s*$/,                                     why:'조건형 구어(-면)로 끝남'},
    {id:'wh-head',  re:/^\s*(어떻게|무엇을|무엇이|뭘|왜|얼마나|이렇게|어디서|누가|언제)\s/, why:'의문사·구어로 시작'},
    {id:'try',      re:/(해\s?보기|봐\s?보기|읽기|따지기)\s*$/,       why:'권유형 풀이(-기)로 끝남'},
    {id:'verb-mod', re:/[가-힣]+는\s[가-힣]+\s*$/,                   why:'동사 풀이형(…는 ○○)'}
  ];
  function labelCheck(s){
    s = (s||'').trim();
    if(!s) return {ok:false, why:'빈 소제목', hits:[]};
    const hits = RULES.filter(r=>r.re.test(s));
    return {ok:hits.length===0, why:hits.map(h=>h.why).join(' · '), hits};
  }
  window.HB = window.HB || {};
  window.HB.labelCheck = labelCheck;
  window.HB.LABEL_RULES = RULES;
})();

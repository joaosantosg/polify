import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Card, CardContent, CircularProgress } from '@mui/material';

const LeitosVisao = () => {
  const [hospitais, setHospitais] = useState([]);
  const [leitos, setLeitos] = useState({});
  const [loading, setLoading] = useState(true);

  // Função para buscar os hospitais
  const fetchHospitais = async () => {
    try {

      const hospitaisData = {"metadata":[{"colName":"cnes","colType":"Numeric","colIndex":0},{"colName":"nome","colType":"String","colIndex":1},{"colName":"municipio","colType":"String","colIndex":2}],"resultset":[[547484,"HCN - HOSPITAL ESTADUAL DO CENTRO NORTE GOIANO","URUACU"],[2337517,"HOSPITAL ORTOPEDICO DE CERES","CERES"],[2337576,"HOSPITAL SAO PIO X","CERES"],[2338262,"HUGO - HOSPITAL DE URGENCIAS DE GOIAS DR VALDEMIRO CRUZ HUGO","GOIANIA"],[2338734,"HGG - HOSPITAL ESTADUAL DR ALBERTO RASSI HGG","GOIANIA"],[2339080,"HEMNSL - HOSPITAL ESTADUAL E MATERNIDADE N SRA DE LOURDES HEMNSL","GOIANIA"],[2339196,"HEMU - HOSPITAL ESTADUAL DA MULHER DR JURANDIR DO NASCIMENTO HEMU","GOIANIA"],[2340194,"HEL - HOSPITAL ESTADUAL DE LUZIANIA","LUZIANIA"],[2343525,"HOSPITAL DE CARIDADE SAO PEDRO D ALCANTARA","GOIAS"],[2361779,"INSTITUTO DE MEDICINA DO COMPORTAMENTO EURIPEDES BARSANULFO","ANAPOLIS"],[2361787,"SANTA CASA DE MISERICORDIA DE ANAPOLIS","ANAPOLIS"],[2361949,"HEJA - HOSPITAL ESTADUAL DE JARAGUA SANDINO DE AMORIM","JARAGUA"],[2382466,"HOSPITAL MUNICIPAL DE MORRINHOS","MORRINHOS"],[2382474,"HRSLMB - HOSPITAL ESTADUAL DE S LUIS DE MONTES BELOS DR GERALDO LANDO","SAO LUIS DE MONTES BELOS"],[2437783,"HEELJ - HOSPITAL ESTADUAL DE PIRENOPOLIS ERNESTINA LOPES JAIME","PIRENOPOLIS"],[2442019,"HOSPITAL SAGRADO CORACAO DE JESUS NEROPOLIS","NEROPOLIS"],[2442477,"HOSPITAL MUNICIPAL HENRIQUE ANTONIO SANTILO","PORANGATU"],[2442604,"HOSPITAL NASR FAIAD","CATALAO"],[2442612,"SANTA CASA DE MISERICORDIA DE CATALAO","CATALAO"],[2442620,"HOSPITAL E MATERNIDADE SAO NICOLAU","CATALAO"],[2506661,"HDT - HOSPITAL ESTADUAL DOENCAS TROPICAIS DR ANUAR AUAD HDT","GOIANIA"],[2517957,"CASA DE EURIPEDES","GOIANIA"],[2519186,"INSTITUTO ESPIRITA BATUIRA DE SAUDE MENTAL","GOIANIA"],[2534967,"HEF - HOSPITAL ESTADUAL DE FORMOSA DR CESAR SAAD FAYAD","FORMOSA"],[2535556,"HEJ - HOSPITAL ESTADUAL DE JATAI DR SERAFIM DE CARVALHO","JATAI"],[2570777,"HGSC HOSPITAL GERAL DE SENADOR CANEDO","SENADOR CANEDO"],[2570823,"HOSPITAL E MATERNIDADE NOSSA SENHORA APARECIDA LTDA","CALDAS NOVAS"],[2589265,"HEI - HOSPITAL ESTADUAL DE ITUMBIARA SAO MARCOS","ITUMBIARA"],[2653818,"HDS - HOSPITAL ESTADUAL DERMATOLOGIA SANIT COLONIA STA MARTA HDS","GOIANIA"],[2673932,"CRER - CRER","GOIANIA"],[2789647,"HOSPITAL MUNICIPAL MODESTO DE CARVALHO","ITUMBIARA"],[2814218,"HOSPITAL DO CANCER DE RIO VERDE","RIO VERDE"],[3771962,"HEANA - HOSPITAL ESTADUAL DE ANAPOLIS DR HENRIQUE SANTILLO HEANA","ANAPOLIS"],[5095808,"HETRIN - HOSPITAL ESTADUAL DE TRINDADE WALDA F DOS SANTOS HETRIN","TRINDADE"],[5419662,"HEAPA - HOSPITAL ESTAD DE APARECIDA DE GOIANIA CAIRO LOUZADA HEAPA","APARECIDA DE GOIANIA"],[5685834,"HOSPITAL DR DOMINGOS MENDES","CERES"],[6665322,"HERSO - HOSPITAL ESTADUAL DE SANTA HELENA DE GOIAS HERSO","SANTA HELENA DE GOIAS"],[7532024,"HOSPITAL PADRE TIAGO NA PROVIDENCIA DE DEUS","JATAI"],[7743068,"HUGOL - HOSPITAL ESTADUAL DE URGENCIAS GOV OTAVIO LAG SIQUEIRA HUGOL","GOIANIA"],[7772173,"CAPS - CREDEQ - COMPLEXO DE REFE ESTADUAL SAUDE MENTAL PROF JAMIL ISSY CRESM","APARECIDA DE GOIANIA"],[8013543,"HOSPITAL MUNICIPAL DR EVARISTO VILELA MACHADO","MINEIROS"],[9138625,"CEAP-SOL - CENTRO ATEN PROLONGADA CASA APOIO COND SOLIDARIEDADE CEAPSOL","GOIANIA"],[932027,"HOSPITAL EDMUNDO FERNANDES","URUACU"],[965324,"HECAD - HOSPITAL ESTADUAL DA CRIANCA E DO ADOLESCENTE HECAD","GOIANIA"],[4261682,"HOSPITAL MATERNO INFANTIL AUGUSTA BASTOS","RIO VERDE"],[4670906,"HEAL - HOSPITAL ESTADUAL DE AGUAS LINDAS RONALDO RAMOS CAIADO FILHO","AGUAS LINDAS DE GOIAS"]],"queryInfo":{"totalRows":"46"}}

      setHospitais(hospitaisData);

      // Agora que temos os hospitais, vamos buscar os dados de leitos de cada um
      hospitaisData.forEach(async (hospital) => {
        const hospitalId = hospital[0]; // paramunidade_mpl é o primeiro item (cnes)
        await fetchLeitos(hospitalId);
      });
    } catch (error) {
      console.error("Erro ao buscar hospitais:", error);
    }
  };

  // Função para buscar os dados de leitos
  const fetchLeitos = async (hospitalId) => {
    try {
      const response = await axios.get(
        `https://indicadores.saude.go.gov.br/pentaho/plugin/cda/api/doQuery?path=/mapa_de_leitos/paineis/painel.cda&dataAccessId=ds_panel_large_number_mpl_ktr&paramunidade_mpl=${hospitalId}&paramunidades_contratos=0`
      );
      const leitosData = response.data.resultset;
      setLeitos(prevLeitos => ({
        ...prevLeitos,
        [hospitalId]: leitosData
      }));
    } catch (error) {
      console.error(`Erro ao buscar leitos para o hospital ${hospitalId}:`, error);
    }
  };

  useEffect(() => {
    fetchHospitais();
  }, []);

  // Função para calcular a porcentagem de ocupação
  const calcularPorcentagem = (ocupados, total) => {
    return total > 0 ? ((ocupados / total) * 100).toFixed(2) : 0;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
        Visão de Leitos
      </Typography>

      {hospitais.length > 0 ? (
        hospitais.map((hospital) => {
          const hospitalId = hospital[0];
          const hospitalLeitos = leitos[hospitalId] || [];

          // Extrair os dados de leitos
          const leitosBloqueados = hospitalLeitos.find(leito => leito[0] === "BLOQUEADO")?.[1] || 0;
          const leitosOcupados = hospitalLeitos.find(leito => leito[0] === "OCUPADO")?.[1] || 0;
          const leitosReservados = hospitalLeitos.find(leito => leito[0] === "RESERVADO")?.[1] || 0;
          const leitosVagos = hospitalLeitos.find(leito => leito[0] === "VAGO")?.[1] || 0;
          const totalLeitos = leitosBloqueados + leitosOcupados + leitosReservados + leitosVagos;

          return (
            <Card key={hospitalId} sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6">{hospital[1]}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Município: {hospital[2]}
                </Typography>

                <Box sx={{ marginTop: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Leitos:
                  </Typography>

                  {/* Detalhes dos leitos */}
                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <Card sx={{ flex: 1, boxShadow: 2, borderRadius: 1, backgroundColor: '#E8F5E9' }}>
                      <CardContent>
                        <Typography variant="h6">Disponíveis</Typography>
                        <Typography variant="body1">{leitosVagos} leitos</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {calcularPorcentagem(leitosVagos, totalLeitos)}% do total
                        </Typography>
                      </CardContent>
                    </Card>

                    <Card sx={{ flex: 1, boxShadow: 2, borderRadius: 1, backgroundColor: '#FFCDD2' }}>
                      <CardContent>
                        <Typography variant="h6">Ocupados</Typography>
                        <Typography variant="body1">{leitosOcupados} leitos</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {calcularPorcentagem(leitosOcupados, totalLeitos)}% do total
                        </Typography>
                      </CardContent>
                    </Card>

                    <Card sx={{ flex: 1, boxShadow: 2, borderRadius: 1, backgroundColor: '#FFEBEE' }}>
                      <CardContent>
                        <Typography variant="h6">Bloqueados</Typography>
                        <Typography variant="body1">{leitosBloqueados} leitos</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {calcularPorcentagem(leitosBloqueados, totalLeitos)}% do total
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>

                  {/* Exibir a porcentagem total de ocupação */}
                  <Typography variant="body2" color="textSecondary">
                    Total de Leitos: {totalLeitos} | % Ocupação: {calcularPorcentagem(leitosOcupados, totalLeitos)}%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          );
        })
      ) : (
        <Typography variant="body2" color="textSecondary">
          Nenhum hospital encontrado para esta cidade.
        </Typography>
      )}
    </Box>
  );
};

export default LeitosVisao;

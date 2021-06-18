import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonPage,
  IonProgressBar,
} from "@ionic/react";
import "./QRates.css";
import Header from "../../components/Header";

import React from "react";
import useUserID from "../../utils/useUserID";
import CZRefresher from "../../components/CZRefresher";
import Tabs from "../../components/Tabs";
import useMunzeeData from "../../utils/useMunzeeData";
import dayjs from "dayjs";
import { RouteChildrenProps } from "react-router";
import { CZTypeImg } from "../../components/CZImg";
import { useTranslation } from "react-i18next";

const UserQRatesPage: React.FC<RouteChildrenProps<{ username: string; type: string; }>> = ({ match }) => {
  const params = match?.params;
  const { t } = useTranslation();
  const userID = useUserID(params?.username);
  const data = useMunzeeData({
    endpoint: "qrates",
    params: { httpMethod: "get" },
    options: { enabled: !!userID },
    user_id: userID,
  });

  return (
    <IonPage>
      <Header title={`${params?.username} - ${t("pages:user_qrates")}`}></Header>

      <IonContent fullscreen>
        <CZRefresher queries={[data]} />
        {(data.data?.data?.qrates.length ?? 0) === 0 && (
          <h4 className="qrate-none">{t("user_qrates:none")}</h4>
        )}
        {data.data?.data?.qrates.map(c => (
          <IonCard key={`card_${c.qrate_id}`} className="qrate-card">
            <IonCardHeader>
              <IonCardSubtitle>
                {t("user_qrates:found", { date: dayjs(c.time_found).format("L LT") })}
              </IonCardSubtitle>
              <IonCardTitle>
                {c.name}{" "}
                {c.qrowbars_used > 0 && (
                  <small>({t("user_qrates:qrowbars", { count: c.qrowbars_used })})</small>
                )}
              </IonCardTitle>
              <IonCardSubtitle>{c.description}</IonCardSubtitle>
            </IonCardHeader>
            <CZTypeImg className="qrate-image" size={128} img={c.logo} />
            <div className="qrate-progress-wrapper">
              <IonProgressBar value={c.progress / c.goal}></IonProgressBar>
              <h4>
                {c.progress} / {c.goal}
              </h4>
            </div>
          </IonCard>
        ))}
      </IonContent>
      <Tabs />
    </IonPage>
  );
};

export default UserQRatesPage;
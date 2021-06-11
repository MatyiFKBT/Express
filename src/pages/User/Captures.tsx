import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonPage,
} from "@ionic/react";
import "./Captures.css";
import Header from "../../components/Header";

import React, { useMemo } from "react";
import useUserID from "../../utils/useUserID";
import CZRefresher from "../../components/CZRefresher";
import Tabs from "../../components/Tabs";
import useCZParams from "../../utils/useCZParams";
import useDB from "../../utils/useDB";
import useMunzeeData from "../../utils/useMunzeeData";
import { Type } from "@cuppazee/db/lib";
import CaptureImg from "../../components/Captures/CaptureImg";
import dayjs from "dayjs";
import { CZTypeImg } from "../../components/CZImg";

const UserCapturesPage: React.FC = () => {
  const params = useCZParams<{ username: string; type: string }>("/user/:username/captures/:type");
  const userID = useUserID(params?.username);
  const data = useMunzeeData({
    endpoint: "user/specials",
    params: { user_id: userID ?? 0 },
    options: { enabled: !!userID },
  });
  const db = useDB();
  const d = useMemo(
    () => {
      const map = new Map<Type, number>();
        for (const munzee of data.data?.data ?? []) {
          const type = db.getType(munzee.logo) ?? db.getType(munzee.name);
          if (type) map.set(type, munzee.count);
        }
      return map;
    },
    [db, data.dataUpdatedAt]
  );
  const category = db.getCategory(params?.type ?? "");

  if (!category) {
    return null;
  }

  return (
    <IonPage>
      <Header title={`${params?.username} - ${category.name}`}></Header>

      <IonContent fullscreen>
        <CZRefresher queries={[data]} />
        {category.children.some(i => i.types.length === 0) && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>{category.name}</IonCardTitle>
            </IonCardHeader>
            {category.children.map(i => (
              <IonItem detail routerLink={`/user/${params?.username}/captures/${i.id}`}>
                <CZTypeImg img={i.icon} slot="start" className="captures-category-image" />
                <IonLabel>{i.name}</IonLabel>
              </IonItem>
            ))}
          </IonCard>
        )}
        {category.children
          .filter(i => i.types.length > 0)
          .map(c => (
            <IonCard key={`card_${c.id}`} className="capture-overview-card">
              <IonCardHeader>
                {c.seasonal && (
                  <IonCardSubtitle>
                    {dayjs(c.seasonal.start).format("L LT")} -{" "}
                    {dayjs(c.seasonal.end).format("L LT")}
                  </IonCardSubtitle>
                )}
                <IonCardTitle>{c.name}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent className="capture-row">
                {c.types?.map(i => (
                  <CaptureImg key={i.icon} type={i} count={d.get(i) ?? 0} />
                ))}
              </IonCardContent>
            </IonCard>
          ))}
      </IonContent>
      <Tabs />
    </IonPage>
  );
};

export default UserCapturesPage;
import { IonContent, IonPage, useIonPicker, useIonRouter, IonButton, IonIcon } from "@ionic/react";
import Header from "../../components/Header";

import React, { useRef, useState } from "react";
import Tabs from "../../components/Tabs";
import { GameID } from "@cuppazee/utils";
import ClanStatsCard from "../../components/Clan/Stats";
import ClanRequirementsCard from "../../components/Clan/Requirements";
import useUserSettings from "../../utils/useUserSettings";
import { UseQueryResult } from "react-query";
import CZRefresher from "../../components/CZRefresher";
import { useTranslation } from "react-i18next";
import { useScrollSyncController } from "../../utils/useScrollSync";
import { RouteChildrenProps } from "react-router";
import blankAnimation from "../../utils/blankAnimation";
import dayjs from "dayjs";
import { chevronDown } from "ionicons/icons";

const ClanAllPage: React.FC<RouteChildrenProps<{ month?: string; year?: string }>> = ({
  match,
}) => {
  const params = match?.params;
  const [sort, setSort] = useState(3);
  const { clans } = useUserSettings() ?? {};
  const queriesRef = useRef<Set<UseQueryResult>>(new Set());
  const { t } = useTranslation();

  const scrollSyncController = useScrollSyncController();

  const game_id = params?.year
    ? new GameID(Number(params.year), Number(params.month) - 1)
    : new GameID();
  
  const history = useIonRouter();
  const [present] = useIonPicker();

  return (
    <IonPage>
      <Header title={t("pages:clans")} />
      <IonContent fullscreen>
        <CZRefresher queries={queriesRef} />
        <IonButton
          size="small"
          className="clan-battle-selector"
          onClick={() => {
            present({
              buttons: [
                {
                  text: "Cancel",
                },
                {
                  text: "Confirm",
                  handler: selected => {
                    const game_id: GameID = selected["Clan Battle"].value;
                    history.push(
                      game_id.game_id === new GameID().game_id
                        ? "/clans"
                        : `/clans/${game_id.month + 1}/${game_id.year}`,
                      undefined,
                      "replace",
                      undefined,
                      blankAnimation
                    );
                  },
                },
              ],
              columns: [
                {
                  name: "Clan Battle",
                  options: new Array(new GameID().game_id - 78)
                    .fill(0)
                    .map((_, n) => new GameID(79 + n))
                    .map(i => ({
                      text: `Battle ${i.game_id} - ${dayjs(i.date).format("MMMM YYYY")}`,
                      value: i,
                    }))
                    .reverse(),
                  selectedIndex: new GameID().game_id - game_id.game_id,
                },
              ],
            });
          }}>
          {dayjs(game_id.date).format("MMMM YYYY")}
          <IonIcon icon={chevronDown} />
        </IonButton>
        {clans && (
          <ClanRequirementsCard
            scrollSyncController={scrollSyncController}
            hasLink
            queriesRef={queriesRef}
            clan_id={clans[0]?.clan_id}
            game_id={game_id}
          />
        )}
        {clans?.map(i => (
          <ClanStatsCard
            scrollSyncController={scrollSyncController}
            queriesRef={queriesRef}
            clan_id={i.clan_id}
            game_id={game_id}
            sort={sort}
            setSort={setSort}
          />
        ))}
      </IonContent>
      <Tabs />
    </IonPage>
  );
};

export default ClanAllPage;

import ServerFlag from "@/components/ServerFlag"
import ServerUsageBar from "@/components/ServerUsageBar"
import { formatBytes } from "@/lib/format"
import { GetFontLogoClass, GetOsName, MageMicrosoftWindows } from "@/lib/logo-class"
import { cn, formatNezhaInfo, getDaysBetweenDates, parsePublicNote } from "@/lib/utils"
import { NezhaServer } from "@/types/nezha-api"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

import { Card } from "./ui/card"
import { Separator } from "./ui/separator"

export default function ServerCardInline({
  now,
  serverInfo,
}: {
  now: number
  serverInfo: NezhaServer
}) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const {
    name,
    country_code,
    online,
    cpu,
    up,
    down,
    mem,
    stg,
    platform,
    uptime,
    net_in_transfer,
    net_out_transfer,
    public_note,
  } = formatNezhaInfo(now, serverInfo)

  const showFlag = true

  const parsedData = parsePublicNote(public_note)

  let daysLeft = 0
  let isNeverExpire = false

  if (parsedData?.billingDataMod?.endDate) {
    if (parsedData.billingDataMod.endDate.startsWith("0000-00-00")) {
      isNeverExpire = true
    } else {
      daysLeft = getDaysBetweenDates(parsedData.billingDataMod.endDate, new Date(now).toISOString())
    }
  }

  return online ? (
    <section>
      <Card
        className={cn(
          "flex items-center lg:flex-row justify-start gap-3 p-3 md:px-5 cursor-pointer hover:bg-accent/50 transition-colors min-w-[900px] w-full",
        )}
        onClick={() => navigate(`/server/${serverInfo.id}`)}
      >
        <section
          className={cn("grid items-center gap-2 lg:w-36")}
          style={{ gridTemplateColumns: "auto auto 1fr" }}
        >
          <span className="h-2 w-2 shrink-0 rounded-full bg-green-500 self-center"></span>
          <div
            className={cn(
              "flex items-center justify-center",
              showFlag ? "min-w-[17px]" : "min-w-0",
            )}
          >
            {showFlag ? <ServerFlag country_code={country_code} /> : null}
          </div>
          <div className="relative w-28 flex flex-col">
            <p
              className={cn(
                "break-all font-bold tracking-tight",
                showFlag ? "text-xs " : "text-sm",
              )}
            >
              {name}
            </p>
            {parsedData?.billingDataMod &&
              (daysLeft >= 0 ? (
                <>
                  <p className={cn("text-[10px] text-muted-foreground")}>
                    剩余时间: {isNeverExpire ? "永久" : daysLeft + "天"}
                  </p>
                  {parsedData.billingDataMod.amount &&
                  parsedData.billingDataMod.amount !== "0" &&
                  parsedData.billingDataMod.amount !== "-1" ? (
                    <p className={cn("text-[10px] text-muted-foreground ")}>
                      价格: {parsedData.billingDataMod.amount}/{parsedData.billingDataMod.cycle}
                    </p>
                  ) : parsedData.billingDataMod.amount === "0" ? (
                    <p className={cn("text-[10px] text-green-600 ")}>免费</p>
                  ) : parsedData.billingDataMod.amount === "-1" ? (
                    <p className={cn("text-[10px] text-pink-600 ")}>按量收费</p>
                  ) : null}
                </>
              ) : (
                <>
                  <p className={cn("text-[10px] text-muted-foreground text-red-600")}>
                    已过期: {daysLeft * -1} 天
                  </p>
                  {parsedData.billingDataMod.amount &&
                  parsedData.billingDataMod.amount !== "0" &&
                  parsedData.billingDataMod.amount !== "-1" ? (
                    <p className={cn("text-[10px] text-muted-foreground ")}>
                      价格: {parsedData.billingDataMod.amount}/{parsedData.billingDataMod.cycle}
                    </p>
                  ) : parsedData.billingDataMod.amount === "0" ? (
                    <p className={cn("text-[10px] text-green-600 ")}>免费</p>
                  ) : parsedData.billingDataMod.amount === "-1" ? (
                    <p className={cn("text-[10px] text-pink-600 ")}>按量收费</p>
                  ) : null}
                </>
              ))}
            {parsedData?.planDataMod && (
              <section className="flex gap-1 items-center flex-wrap mt-0.5">
                {parsedData.planDataMod.bandwidth !== "" && (
                  <p
                    className={cn(
                      "text-[9px] bg-blue-600 dark:bg-blue-800 text-blue-200 dark:text-blue-300  w-fit rounded-[5px] px-[3px] py-[1.5px]",
                    )}
                  >
                    {parsedData.planDataMod.bandwidth}
                  </p>
                )}
                {parsedData.planDataMod.trafficVol !== "" && (
                  <p
                    className={cn(
                      "text-[9px] bg-green-600 text-green-200 dark:bg-green-800 dark:text-green-300  w-fit rounded-[5px] px-[3px] py-[1.5px]",
                    )}
                  >
                    {parsedData.planDataMod.trafficVol}
                  </p>
                )}
              </section>
            )}
          </div>
        </section>
        <Separator orientation="vertical" className="h-8 mx-0 ml-2" />
        <div className="flex flex-col gap-2">
          <section className={cn("grid grid-cols-9 items-center gap-3 flex-1")}>
            <div className={"items-center flex flex-row gap-2 whitespace-nowrap"}>
              <div className="text-xs font-semibold">
                {platform.includes("Windows") ? (
                  <MageMicrosoftWindows className="size-[10px]" />
                ) : (
                  <p className={`fl-${GetFontLogoClass(platform)}`} />
                )}
              </div>
              <div className={"flex w-14 flex-col"}>
                <p className="text-xs text-muted-foreground">{t("serverCard.system")}</p>
                <div className="flex items-center text-[10.5px] font-semibold">
                  {platform.includes("Windows") ? "Windows" : GetOsName(platform)}
                </div>
              </div>
            </div>
            <div className={"flex w-20 flex-col"}>
              <p className="text-xs text-muted-foreground">{t("serverCard.uptime")}</p>
              <div className="flex items-center text-xs font-semibold">
                {uptime / 86400 >= 1
                  ? `${(uptime / 86400).toFixed(0)} ${t("serverCard.days")}`
                  : `${(uptime / 3600).toFixed(0)} ${t("serverCard.hours")}`}
              </div>
            </div>
            <div className={"flex w-14 flex-col"}>
              <p className="text-xs text-muted-foreground">{"CPU"}</p>
              <div className="flex items-center text-xs font-semibold">{cpu.toFixed(2)}%</div>
              <ServerUsageBar value={cpu} />
            </div>
            <div className={"flex w-14 flex-col"}>
              <p className="text-xs text-muted-foreground">{t("serverCard.mem")}</p>
              <div className="flex items-center text-xs font-semibold">{mem.toFixed(2)}%</div>
              <ServerUsageBar value={mem} />
            </div>
            <div className={"flex w-14 flex-col"}>
              <p className="text-xs text-muted-foreground">{t("serverCard.stg")}</p>
              <div className="flex items-center text-xs font-semibold">{stg.toFixed(2)}%</div>
              <ServerUsageBar value={stg} />
            </div>
            <div className={"flex w-16 flex-col"}>
              <p className="text-xs text-muted-foreground">{t("serverCard.upload")}</p>
              <div className="flex items-center text-xs font-semibold">
                {up >= 1024
                  ? `${(up / 1024).toFixed(2)}G/s`
                  : up >= 1
                    ? `${up.toFixed(2)}M/s`
                    : `${(up * 1024).toFixed(2)}K/s`}
              </div>
            </div>
            <div className={"flex w-16 flex-col"}>
              <p className="text-xs text-muted-foreground">{t("serverCard.download")}</p>
              <div className="flex items-center text-xs font-semibold">
                {down >= 1024
                  ? `${(down / 1024).toFixed(2)}G/s`
                  : up >= 1
                    ? `${down.toFixed(2)}M/s`
                    : `${(down * 1024).toFixed(2)}K/s`}
              </div>
            </div>
            <div className={"flex w-20 flex-col"}>
              <p className="text-xs text-muted-foreground">{t("serverCard.totalUpload")}</p>
              <div className="flex items-center text-xs font-semibold">
                {formatBytes(net_out_transfer)}
              </div>
            </div>
            <div className={"flex w-20 flex-col"}>
              <p className="text-xs text-muted-foreground">{t("serverCard.totalDownload")}</p>
              <div className="flex items-center text-xs font-semibold">
                {formatBytes(net_in_transfer)}
              </div>
            </div>
          </section>
        </div>
      </Card>
    </section>
  ) : (
    <Card
      className={cn(
        "flex  min-h-[61px] min-w-[900px] items-center justify-start gap-3 p-3 md:px-5 flex-row cursor-pointer hover:bg-accent/50 transition-colors",
      )}
      onClick={() => navigate(`/server/${serverInfo.id}`)}
    >
      <section
        className={cn("grid items-center gap-2 lg:w-40")}
        style={{ gridTemplateColumns: "auto auto 1fr" }}
      >
        <span className="h-2 w-2 shrink-0 rounded-full bg-red-500 self-center"></span>
        <div
          className={cn("flex items-center justify-center", showFlag ? "min-w-[17px]" : "min-w-0")}
        >
          {showFlag ? <ServerFlag country_code={country_code} /> : null}
        </div>
        <div className="relative flex flex-col">
          <p
            className={cn(
              "break-all font-bold w-28 tracking-tight",
              showFlag ? "text-xs" : "text-sm",
            )}
          >
            {name}
          </p>
          {parsedData?.billingDataMod &&
            (daysLeft >= 0 ? (
              <>
                <p className={cn("text-[10px] text-muted-foreground")}>
                  剩余时间: {isNeverExpire ? "永久" : daysLeft + "天"}
                </p>
                {parsedData.billingDataMod.amount &&
                parsedData.billingDataMod.amount !== "0" &&
                parsedData.billingDataMod.amount !== "-1" ? (
                  <p className={cn("text-[10px] text-muted-foreground ")}>
                    价格: {parsedData.billingDataMod.amount}/{parsedData.billingDataMod.cycle}
                  </p>
                ) : parsedData.billingDataMod.amount === "0" ? (
                  <p className={cn("text-[10px] text-green-600 ")}>免费</p>
                ) : parsedData.billingDataMod.amount === "-1" ? (
                  <p className={cn("text-[10px] text-pink-600 ")}>按量收费</p>
                ) : null}
              </>
            ) : (
              <>
                <p className={cn("text-[10px] text-muted-foreground text-red-600")}>
                  已过期: {daysLeft * -1} 天
                </p>
                {parsedData.billingDataMod.amount &&
                parsedData.billingDataMod.amount !== "0" &&
                parsedData.billingDataMod.amount !== "-1" ? (
                  <p className={cn("text-[10px] text-muted-foreground ")}>
                    价格: {parsedData.billingDataMod.amount}/{parsedData.billingDataMod.cycle}
                  </p>
                ) : parsedData.billingDataMod.amount === "0" ? (
                  <p className={cn("text-[10px] text-green-600 ")}>免费</p>
                ) : parsedData.billingDataMod.amount === "-1" ? (
                  <p className={cn("text-[10px] text-pink-600 ")}>按量收费</p>
                ) : null}
              </>
            ))}
          {parsedData?.planDataMod && (
            <section className="flex gap-1 items-center flex-wrap mt-0.5">
              {parsedData.planDataMod.bandwidth !== "" && (
                <p
                  className={cn(
                    "text-[9px] bg-blue-600 dark:bg-blue-800 text-blue-200 dark:text-blue-300  w-fit rounded-[5px] px-[3px] py-[1.5px]",
                  )}
                >
                  {parsedData.planDataMod.bandwidth}
                </p>
              )}
              {parsedData.planDataMod.trafficVol !== "" && (
                <p
                  className={cn(
                    "text-[9px] bg-green-600 text-green-200 dark:bg-green-800 dark:text-green-300  w-fit rounded-[5px] px-[3px] py-[1.5px]",
                  )}
                >
                  {parsedData.planDataMod.trafficVol}
                </p>
              )}
            </section>
          )}
        </div>
      </section>
    </Card>
  )
}
